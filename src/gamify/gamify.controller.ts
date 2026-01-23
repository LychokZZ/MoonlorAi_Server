import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GamifyService } from './gamify.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface StreackDto {
    userId: string;
}

@Controller('gamify')
export class GamifyController {

    constructor(private gamifyService: GamifyService) { }

    @Get('gamifyData')
    @UseGuards(JwtAuthGuard)
    async getGamifyData(@Body() userId: string, @Res() res: Response) {
        return this.gamifyService.getGamifyData(userId);
    }

    @Post('updateStreak')
    @UseGuards(JwtAuthGuard)
    async checkStreak(@Req() req, @Res() res: Response) {
        const userId = req.user?.userId
        return this.gamifyService.checkStreak(userId);
    }

    @Post('addXp')
    @UseGuards(JwtAuthGuard)
    async addGamifyXp(@Req() req) {
        const userId = req.user?.userId;
        const Xp = req.body?.data.count
        return this.gamifyService.addGamifyXp(userId, Xp)
    }

    @Get('leaderboardMy')
    @UseGuards(JwtAuthGuard)
    async leaderboardMy(@Req() req) {
        const userId = req.user?.userId
        return this.gamifyService.leaderboardCheckMy(userId)
    }

    @Get('leaderboardAll')
    async leaderboardAll(@Req() req) {
        return this.gamifyService.leaderboardCheckAll()
    }

    //statistic

    @Post('count-medetation')
    @UseGuards(JwtAuthGuard)
    async countMedetation(@Req() req) {
        const userId = req.user?.userId
        return this.gamifyService.countMedetation(userId)
    }
}
