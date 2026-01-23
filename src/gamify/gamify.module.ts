import { Module } from '@nestjs/common';
import { GamifyController } from './gamify.controller';
import { GamifyService } from './gamify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/sheme/user.entity';
import { Gamify } from 'src/sheme/gamify.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Statistic } from 'src/sheme/statistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Gamify, Statistic]),
    AuthModule,
  ],

  controllers: [GamifyController],
  providers: [GamifyService],
  exports: [GamifyService],
})
export class GamifyModule { }
