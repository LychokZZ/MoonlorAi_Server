import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gamify } from 'src/sheme/gamify.entity';
import { Statistic } from 'src/sheme/statistic.entity';
import { User } from 'src/sheme/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GamifyService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Gamify)
        private readonly gamifyRepository: Repository<Gamify>,

        @InjectRepository(Statistic)
        private readonly statisticRepository: Repository<Statistic>,
    ) { }

    async getGamifyData(userId: string) {
        const gamifyData = await this.gamifyRepository.findOne({ where: { user: { id: userId } } });
        if (!gamifyData) { throw new Error('User not found'); }

        return gamifyData;
    }

    async addGamifyXp(userId: string, AddXp: any) {
        const gamifyData = await this.gamifyRepository.findOne({ where: { user: { id: userId } } });
        if (!gamifyData) { throw new Error('User not found'); }

        gamifyData.xp = gamifyData.xp + AddXp;

        return this.gamifyRepository.save(gamifyData);
    }

    toUtcDay = (s) => {
        const [y, m, d] = s.split('-').map(Number);
        return Date.UTC(y, m - 1, d);
    };

    diffDays = (a, b) => (this.toUtcDay(a) - this.toUtcDay(b)) / 86400000;

    async checkStreak(userId: string) {
        const gamifyData = await this.gamifyRepository.findOne({ where: { user: { id: userId } } });
        if (!gamifyData) { throw new Error('User not found'); }

        const today = new Date().toISOString().slice(0, 10);
        const lastActivity = gamifyData.lastActivity;

        const diff = this.diffDays(today, lastActivity);
        if (diff === 0) {
            return gamifyData.currentStreak;
        } else if (diff === 1) {
            gamifyData.currentStreak += 1;
        } else if (diff > 1) {
            gamifyData.currentStreak = 0;
        }

        gamifyData.lastActivity = today;
        await this.gamifyRepository.save(gamifyData);
        return { message: 'Streak updated', currentStreak: gamifyData.currentStreak };
    }


    async leaderboardCheckMy(userId: string) {
        const qb = this.gamifyRepository
            .createQueryBuilder('g')
            .innerJoin('g.user', 'u')
            .select([
                'u.id AS "userId"',
                'g.xp AS "xp"',
                'g.lastActivity AS "lastActivity"',
                `RANK() OVER (ORDER BY g.xp DESC, g.lastActivity ASC) AS "position"`,
            ]);

        const result = await this.gamifyRepository.manager
            .createQueryBuilder()
            .select('*')
            .from(`(${qb.getQuery()})`, 't')
            .setParameters(qb.getParameters())
            .where(`t."userId" = :userId`, { userId })
            .getRawOne();

        return result;
    }

    async leaderboardCheckAll() {
        const board = await this.gamifyRepository
            .createQueryBuilder('g')
            .leftJoinAndSelect('g.user', 'u')
            .select(['g.id', 'g.xp', 'g.lastActivity', 'u.id', 'u.Username'])
            .orderBy('g.xp', 'DESC')
            .addOrderBy('g.lastActivity', 'ASC')
            .take(10)
            .getMany();

        return board
    }

    async countMedetation(userId: string) {
        const Statistic = await this.statisticRepository.findOne({ where: { user: { id: userId } } })
        if (!Statistic) { throw new Error('Statistic not found'); }
        Statistic.countMeditation += 1;
        await this.statisticRepository.save(Statistic)
        return { message: 'Successful' }
    }
}
