import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("ai")
export class GeminiController {
  constructor(private readonly gemini: GeminiService) {}

  @Post("chat_init")
  @UseGuards(JwtAuthGuard)
  async chat(@Req() req) {
    const userId = req.user?.userId
    const TypeChat = req.body?.TypeChat
    console.log(userId,TypeChat)
    return this.gemini.initChat(userId,TypeChat);
  }
          
  @Post('chat_send')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Req() req){
    const userId = req.user?.userId
    const message = req.body?.Messege
    console.log(userId,message)
    return this.gemini.sendMessage(userId,message)
  }
}
