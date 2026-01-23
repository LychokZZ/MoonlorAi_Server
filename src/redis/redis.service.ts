import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

interface GeminiChatState {
  chatId: string;
  model: string;
  systemInstruction: string;
  history: {
    role: 'user' | 'model';
    parts: { text: string }[];
  }[];
}


@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async set(key: string, value: any, ttlSeconds: number) {
    const data = typeof value === 'string' ? value :JSON.stringify(value)

    await this.client.set(key, value, 'EX', ttlSeconds);
  }
  async get<T = any>(key: string): Promise<T | null> {
    
      const data = await this.client.get(key);
      if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch{
      return data as T;
    }
  }
  async del(key: string) {
    await this.client.del(key);
  }

  
}
