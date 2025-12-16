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

dotenv.config();

@Module({
  
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User,Onboard,Gamify],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    MailModule,
    GamifyModule,
    RedisModule,
  ],
  controllers: [AppController,],
  providers: [AppService],
  
})
export class AppModule {}
