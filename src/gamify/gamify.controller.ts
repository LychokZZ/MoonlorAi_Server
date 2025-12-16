import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { GamifyService } from './gamify.service';

interface StreackDto {
    userId: string;
}

@Controller('gamify')
export class GamifyController {

    constructor(private gamifyService: GamifyService) {}

    @Get('gamifyData')
    async getGamifyData(@Body() userId: string , @Res() res: Response) {
        return this.gamifyService.getGamifyData(userId);
    }

    @Post('updateStreak')
    async checkStreak(@Body() dto: StreackDto , @Res() res: Response) {
        return this.gamifyService.checkStreak(dto);
    }
}
