import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meditation } from '../sheme/meditation.entity';
import { MeditationsService } from './meditations.service';
import { MeditationsController } from './meditations.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meditation]), SupabaseModule],
  providers: [MeditationsService],
  controllers: [MeditationsController],
})
export class MeditationsModule {}
