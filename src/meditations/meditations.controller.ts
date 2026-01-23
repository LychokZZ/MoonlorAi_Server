import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeditationsService } from './meditations.service';

@Controller('meditations')
export class MeditationsController {
  constructor(private readonly service: MeditationsService) {}

  @Post('upload-free')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFree(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; category: string; createdByUserId?: string },
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!file.mimetype?.includes('audio')) throw new BadRequestException('file must be audio/mp3');
    if (!body?.title || !body?.category) throw new BadRequestException('title and category required');

    return this.service.uploadFree(file, body);
  }


    @Get(':id/audio')
    async getAudio(@Param('id') id: string) {
        const url = await this.service.getAudioUrlById(id);
        return url; 
    }
    
}
