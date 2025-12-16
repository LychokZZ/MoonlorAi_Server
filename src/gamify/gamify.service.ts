import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gamify } from 'src/sheme/gamify.entity';
import { User } from 'src/sheme/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GamifyService {
    constructor(
            @InjectRepository(User)
            private readonly userRepository: Repository<User>,

            @InjectRepository(Gamify)
            private readonly gamifyRepository: Repository<Gamify>,  
    ) {}

    async getGamifyData(userId: string) {
        const gamifyData = await this.gamifyRepository.findOne({where: {user: {id: userId}}});
        if (!gamifyData) {throw new Error('User not found');}

        return gamifyData;
    }

    async updateGamifyXp(userId: string, AddXp: number) {
        const gamifyData = await this.gamifyRepository.findOne({where: {user: {id: userId}}});
        if (!gamifyData) {throw new Error('User not found');}

        gamifyData.xp = gamifyData.xp + AddXp;
 
        return this.gamifyRepository.save(gamifyData);
    }

    toUtcDay = (s) => {
        const [y, m, d] = s.split('-').map(Number);
        return Date.UTC(y, m - 1, d); 
    };

    diffDays = (a, b) => (this.toUtcDay(a) - this.toUtcDay(b)) / 86400000;

    async checkStreak (dto : {userId: string}) {
        const userId = dto.userId;
        const gamifyData = await this.gamifyRepository.findOne({where: {user: {id: userId}}});
        if (!gamifyData) {throw new Error('User not found');}

        const today = new Date().toISOString().slice(0, 10);  
        const lastActivity = gamifyData.lastActivity;

        const diff = this.diffDays(today, lastActivity);
        if (diff === 0) {
            return gamifyData.currentStreak;
        }else if (diff === 1) {
            gamifyData.currentStreak += 1;
        }else if (diff > 1) {
            gamifyData.currentStreak = 0;  
        }

        gamifyData.lastActivity = today;
        await this.gamifyRepository.save(gamifyData);
        return {message: 'Streak updated', currentStreak: gamifyData.currentStreak};
    }

}
