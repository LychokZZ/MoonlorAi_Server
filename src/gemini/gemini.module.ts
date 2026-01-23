import { Module } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { GeminiController } from "./gemini.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/sheme/user.entity";
import { Gamify } from "src/sheme/gamify.entity";
import { AuthModule } from "src/auth/auth.module";
import { GamifyModule } from "src/gamify/gamify.module";
import { RedisModule } from "src/redis/redis.module";
import { Gemini } from "src/sheme/gemini.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User,Gamify,Gemini]),
  RedisModule,
  AuthModule,
  GamifyModule,
],
  providers: [GeminiService],
  controllers: [GeminiController],
  exports: [GeminiService],
})
export class GeminiModule {}
