import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/sheme/user.entity';
import { Onboard } from 'src/sheme/onboarding.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { MailModule } from 'src/mail/mail.module';
import { Gamify } from 'src/sheme/gamify.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Gemini } from 'src/sheme/gemini.entity';
import { Statistic } from 'src/sheme/statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Onboard, Gamify, Gemini, Statistic]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '15m' },
  }),
    RedisModule,
    MailModule,
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule { }
