import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meditation } from '../sheme/meditation.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MeditationsService {
  constructor(
    @InjectRepository(Meditation) private readonly repo: Repository<Meditation>,
    private readonly supabase: SupabaseService,
  ) { }

  async uploadFree(
    file: Express.Multer.File,
    dto: { title: string; category: string; createdByUserId?: string },
  ) {
    const bucket = process.env.SUPABASE_BUCKET_FREE!;
    const ext = (file.originalname.split('.').pop() || 'mp3').toLowerCase();
    const path = `${dto.category}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await this.supabase.client.storage
      .from(bucket)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (uploadError) throw new BadRequestException(uploadError.message);

    const { data } = this.supabase.client.storage
      .from(bucket)
      .getPublicUrl(path);

    const meditation = this.repo.create({
      title: dto.title,
      category: dto.category,
      bucket,
      path,
      createdByUserId: dto.createdByUserId,
      isFree: true,
    });

    await this.repo.save(meditation);

    return {
      ...meditation,
      audioUrl: data.publicUrl,
    };
  }

  async getAudioUrlById(id: string) {
    const meditation = await this.repo.findOne({ where: { id } });
    if (!meditation) throw new NotFoundException('Meditation not found');

    // public bucket → просто public URL
    const { data } = this.supabase.client.storage
      .from(meditation.bucket)
      .getPublicUrl(meditation.path);

    return { audioUrl: data.publicUrl };
  }
}
