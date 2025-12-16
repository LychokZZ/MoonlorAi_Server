import { Module } from '@nestjs/common';
import { GamifyController } from './gamify.controller';
import { GamifyService } from './gamify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/sheme/user.entity';
import { Gamify } from 'src/sheme/gamify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Gamify]),],
  controllers: [GamifyController],
  providers: [GamifyService]
})
export class GamifyModule {}
