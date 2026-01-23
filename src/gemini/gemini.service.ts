import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GamifyService } from "src/gamify/gamify.service";
import { Gamify } from "src/sheme/gamify.entity";
import { Gemini } from "src/sheme/gemini.entity";
import { User } from "src/sheme/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GeminiService {
  private ai: any;
  private aiInitPromise?: Promise<void>;

  private chats = new Map<string, any>();
  private genShortContentTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Gamify)
    private readonly gamifyRepository: Repository<Gamify>,

    private readonly gamifyService: GamifyService,

    @InjectRepository(Gemini)
    private readonly geminiRepository: Repository<Gemini>,
  ) {
    // Лінива ініціалізація в ensureAi(). Тут нічого не робимо.
  }

  private extractText(res: any): string {
    if (!res) return "";
    if (typeof res.text === "string") return res.text;                 // частий кейс
    if (typeof res.response?.text === "function") return res.response.text(); // інколи так
    if (typeof res.response?.text === "string") return res.response.text;
    return String(res);
  }


  private async ensureAi() {
    if (this.ai) return;

    if (!this.aiInitPromise) {
      this.aiInitPromise = import("@google/genai").then(({ GoogleGenAI }) => {
        this.ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY!,
        });
      });
    }

    await this.aiInitPromise;
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private isRetryableGeminiError(e: any) {
    const status = e?.status ?? e?.code;
    const msg = String(e?.message ?? "");
    return status === 503 || status === 429 || status === 500 || msg.includes("UNAVAILABLE");
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    opts: { retries?: number; baseDelayMs?: number; maxDelayMs?: number } = {},
  ): Promise<T> {
    const retries = opts.retries ?? 5;
    const baseDelayMs = opts.baseDelayMs ?? 800;
    const maxDelayMs = opts.maxDelayMs ?? 8000;

    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (e) {
        attempt++;
        if (attempt > retries || !this.isRetryableGeminiError(e)) {
          throw e;
        }

        const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
        const jitter = Math.floor(Math.random() * 250);
        await this.sleep(backoff + jitter);
      }
    }
  }

  private scheduleShortSummary(userId: string) {
    const prev = this.genShortContentTimeouts.get(userId);
    if (prev) clearTimeout(prev);

    const timeout = setTimeout(async () => {
      try {
        await this.GenShortContent(userId);
      } catch (e) {
        console.error("Error in GenShortContent", e);
      } finally {
        this.genShortContentTimeouts.delete(userId);
      }
    }, 60_000);

    this.genShortContentTimeouts.set(userId, timeout);
  }

  async initChat(userId: string, TypeChat?: string) {
    await this.ensureAi();

    if (this.chats.has(userId)) {
      const chat = this.chats.get(userId);
      return { text: chat.history };
    }

    const systemInstruction = TypeChat ?? "Ти психолог!";

    const chat = this.ai.chats.create({
      model: "gemini-2.5-flash-lite",
      config: { systemInstruction },
      history: [
        {
          role: "model",
          parts: [{ text: "Радий бути поруч. Про що ти хотів би поговорити зараз?" }],
        },
      ],
    });

    const newState = {
      model: chat.model,
      systemInstruction: chat.config.systemInstruction,
      history: chat.history,
    };

    await this.geminiRepository.update(
      { user: { id: userId } },
      { state: { state: newState } },
    );

    this.chats.set(userId, chat);

    this.scheduleShortSummary(userId);

    return { text: chat.history };
  }

  async ReNitChat(userId: string, state: any) {
    await this.ensureAi();

    const chat = this.ai.chats.create({
      model: state.model,
      config: { systemInstruction: state.systemInstruction },
      history: state.history,
    });

    this.chats.set(userId, chat);
  }

  async sendMessage(userId: string, message: string) {
    await this.ensureAi();

    let chat = this.chats.get(userId);

    if (!chat) {
      const geminiData = await this.geminiRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!geminiData?.state?.state) {
        throw new Error("Gemini state not found. Call initChat first.");
      }
      await this.ReNitChat(userId, geminiData.state.state);
      chat = this.chats.get(userId);
    }

    const res = await this.withRetry(() => chat.sendMessage({ message }));

    await this.gamifyService.addGamifyXp(userId, 5);

    const newState = {
      model: chat.model,
      systemInstruction: chat.config.systemInstruction,
      history: chat.history,
    };

    const gemini = await this.geminiRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!gemini) throw new Error("Gemini profile not found");

    gemini.state = { state: newState };
    await this.geminiRepository.save(gemini);

    this.scheduleShortSummary(userId);

    return { text: chat.history };
  }
  async GenShortContent(userId: string) {
    await this.ensureAi();

    const chat = this.chats.get(userId);
    if (!chat) {
      throw new Error("Chat not initialized for this user");
    }

    const gemData = await this.geminiRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!gemData) {
      throw new Error("GemData not initialized for this user");
    }

    const prompt = `Стисло підсумуй усю нашу історію спілкування та поєднай з стислою історією минулого чату: ${gemData.Summary} (5–7 речень, без води).`;

    const res = await this.withRetry(() => chat.sendMessage({ message: prompt }));
    const newState = {
      model: chat.model,
      systemInstruction: chat.config.systemInstruction,
      history: [
        {
          role: "model",
          parts: [{ text: "Радий бути поруч. Про що ти хотів би поговорити зараз?" }],
        },
      ],
    };

    gemData.state = { state: newState };
    // У @google/genai часто є res.text; якщо ні — підлаштуй під свою відповідь
    gemData.Summary = this.extractText(res);
    await this.geminiRepository.save(gemData);

    this.clearChat(userId);
  }

  clearChat(userId: string) {
    const t = this.genShortContentTimeouts.get(userId);
    if (t) {
      clearTimeout(t);
      this.genShortContentTimeouts.delete(userId);
    }
    this.chats.delete(userId);
  }
}
