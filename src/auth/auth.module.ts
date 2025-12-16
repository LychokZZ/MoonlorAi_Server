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

@Module({
  imports: [TypeOrmModule.forFeature([User,Onboard,Gamify]),
    JwtModule,
    RedisModule,
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
