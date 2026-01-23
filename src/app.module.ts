import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './sheme/user.entity';
import { Onboard } from './sheme/onboarding.entity';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { Gamify } from './sheme/gamify.entity';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { GamifyModule } from './gamify/gamify.module';
import { SupabaseModule } from './supabase/supabase.module';
import { Meditation } from './sheme/meditation.entity';
import { MeditationsModule } from './meditations/meditations.module';
import { GeminiService } from './gemini/gemini.service';
import { GeminiModule } from './gemini/gemini.module';
import { Gemini } from './sheme/gemini.entity';
import { Statistic } from './sheme/statistic.entity';

dotenv.config();

@Module({

  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Onboard, Gamify, Meditation, Gemini, Statistic],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    MailModule,
    GamifyModule,
    RedisModule,
    SupabaseModule,
    MeditationsModule,
    GeminiModule,
  ],
  controllers: [AppController,],
  providers: [AppService],

})
export class AppModule { }
