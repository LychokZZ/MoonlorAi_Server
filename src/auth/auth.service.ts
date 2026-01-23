import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Onboard } from 'src/sheme/onboarding.entity';
import { User } from 'src/sheme/user.entity';

import { RegisterDto } from './dto/register.dto/register.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto/login.dto';
import { RedisService } from 'src/redis/redis.service';
import { sendCode } from './dto/restor.dto/restore.dto';
import { MailService } from 'src/mail/mail.service';
import { Gamify } from 'src/sheme/gamify.entity';
import { Gemini } from 'src/sheme/gemini.entity';
import { Statistic } from 'src/sheme/statistic.entity';

type Lang = 'UA' | 'EN';
type PageTexts = 'TextDashboard' | 'TextMedetation' | 'AddsTextAiChats' | 'StatasText' | 'AchivmentsText' | 'LeaderBoardText' | 'SettingText' | 'MainLandPageText';

const modules = {
    UA: () => import('../language/ua'),
    EN: () => import('../language/en'),
};

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwt: JwtService,
        private readonly redis: RedisService,
        private readonly mailService: MailService,

        @InjectRepository(Onboard)
        private readonly onboardRepository: Repository<Onboard>,


        @InjectRepository(Gamify)
        private readonly gamifyRepository: Repository<Gamify>,

        @InjectRepository(Gemini)
        private readonly geminiRepository: Repository<Gemini>,

        @InjectRepository(Statistic)
        private readonly statisticRepository: Repository<Statistic>,


    ) { }


    async generateTokens(user: User) {
        try {
            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role
            }
            const access_token = await this.jwt.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1m',
            });
            const refresh_token = await this.jwt.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '30d',
            });

            return { access_token, refresh_token };
        } catch (error) {
            throw new Error('Invalid generate tokens');
        }
    }

    async register(dto: RegisterDto) {
        try {
            const exitsEmail = await this.userRepository.findOne({ where: { email: dto.data.Email } })
            if (exitsEmail) throw new BadRequestException('User with this email already exists');

            const exitsUser = await this.userRepository.findOne({ where: { Username: dto.data.Name } })
            if (exitsUser) throw new BadRequestException('User with this username already exists');

            const hashpass = await bcrypt.hash(dto.data.Password, 10)

            const user = this.userRepository.create({
                Username: dto.data.Name,
                email: dto.data.Email,
                passwordHash: hashpass,
                role: dto.data.role,
            });
            await this.userRepository.save(user);
            const Onboard = this.onboardRepository.create({
                socialLevel: dto.data.socialLevel,
                emotionLevel: dto.data.emotionLevel,
                functionLevel: dto.data.functionLevel,
                identityLevel: dto.data.identityLevel,
                user: user
            })
            const DateNow = new Date().toISOString().slice(0, 10);
            const Gamify = this.gamifyRepository.create({
                user: user,
                xp: 0,
                currentStreak: 0,
                lastActivity: DateNow,
            })
            const Gemini = this.geminiRepository.create({
                user: user,
                Summary: '',
                state: {},
            })
            const AverageEmotionLvl = Math.round(
                ((dto.data.socialLevel + dto.data.emotionLevel + dto.data.functionLevel + dto.data.identityLevel) / 145) * 100
            );
            const Statistic = this.statisticRepository.create({
                user: user,
                countMeditation: 0,
                avarageEmotion: AverageEmotionLvl,
                avarageEmotionList: [0],
                hoursPractic: 0
            })


            await this.onboardRepository.save(Onboard)
            await this.gamifyRepository.save(Gamify)
            await this.geminiRepository.save(Gemini)
            await this.statisticRepository.save(Statistic)
            console.log(user)
            const tokens = await this.generateTokens(user)
            console.log(tokens)
            await this.writeRefresh(user.id, tokens.refresh_token)
            const userData = {
                Username: user.Username,
                id: user.id,
                email: user.email,
                role: user.role,
            }
            return {
                messeges: 'Successful',
                userData,
                tokens
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async login(dto: LoginDto) {
        try {
            const user = await this.userRepository.findOne({ where: { email: dto.data.Email } });
            if (!user) throw new UnauthorizedException('Wrong email!');

            const passOk = await bcrypt.compare(dto.data.Password, user.passwordHash);
            if (!passOk) throw new UnauthorizedException('Wrong password!');

            const tokens = await this.generateTokens(user)
            await this.writeRefresh(user.id, tokens.refresh_token)

            const userData = {
                Username: user.Username,
                id: user.id,
                email: user.email,
                role: user.role,
            }
            return {
                messeges: 'Successful',
                userData,
                tokens
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async writeRefresh(userId: string, refreshToken: string) {
        if (!refreshToken) throw new BadRequestException('Refresh token is missing');

        const hash = await bcrypt.hash(refreshToken, 10);

        await this.userRepository.update(
            { id: userId },
            { refreshTokenHash: hash },
        );
    }


    async refreshToken(refresh: string) {
        try {
            const payload = await this.jwt.verifyAsync(refresh, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            if (!user || !user.refreshTokenHash) {
                throw new Error('User not found or no refresh hash');
            }

            const ok = await bcrypt.compare(refresh, user.refreshTokenHash);
            if (!ok) {
                throw new Error('Invalid refresh token');
            }
            const { access_token, refresh_token } = await this.generateTokens(user);

            await this.writeRefresh(user.id, refresh_token);

            return { access_token, refresh_token };
        } catch (e) {
            throw new Error('Invalid refresh');
        }
    }

    async logout(userId: string) {
        try {
            await this.userRepository.update(userId, { refreshTokenHash: null });
            return { message: 'Logged out' };
        } catch (error) {
            throw new Error('Invalid logout');
        }
    }

    async resetPassword_generate(emailChek) {
        try {
            const user = await this.userRepository.findOne({ where: { email: emailChek.email }, });
            if (!user) return { message: 'Wrong email' };


            const code = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');

            const redisKey = `reset:${emailChek.email}`;

            await this.redis.set(redisKey, code.toString(), 185)


            await this.mailService.sendResetCode(emailChek.email, code.toString());

            return { message: 'Successful' }
        } catch (error) {
            throw new Error('Invalid send verify code');
        }
    }

    async resetPassword_send(dto: sendCode) {
        try {
            const redisKey = `reset:${dto.emailChek}`;
            const value = await this.redis.get(redisKey)

            if (!value) {
                throw new Error('Code has expired')
            }
            if (dto.code !== value) {
                return { message: 'Code is not valid' }
            }
            if (dto.code === value) {
                await this.redis.del(redisKey)
                return { message: 'Successful' }
            }


        } catch (error) {
            throw new Error('Invalid check verify code')
        }
    }


    async getMe(userId: string) {
        const user = this.userRepository.findOne({ where: { id: userId } });
        if (!user) return { message: 'Wrong authorize' };

        const gamifyData = this.gamifyRepository.findOne({ where: { user: { id: userId } } })
        if (!gamifyData) return { message: 'Wrong gamify data' };

        const statisticData = this.statisticRepository.findOne({ where: { user: { id: userId } } })
        if (!statisticData) return { message: 'Wrong statistic data' };

        const userData = {
            Email: (await user).email,
            Username: (await user).Username,
            isActive: (await user).isActive,
            role: (await user).role,
            xp: (await gamifyData)?.xp,
            leaderboard: (await gamifyData)?.leaderboardPosition,
            streak: (await gamifyData)?.currentStreak,
            Language: (await user).Language,
            countMedetation: (await statisticData).countMeditation,
            avarageEmotion: (await statisticData).avarageEmotion,
            avarageEmotionList: (await statisticData).avarageEmotionList,
            hoursPractic: (await statisticData).hoursPractic,
        }

        return userData
    }

    async LangGet(userId: string, lang: string) {
        console.log(userId, lang)
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return { message: 'Wrong authorize' };
        }

        user.Language = lang;
        await this.userRepository.save(user);

        return { message: 'Successful' };
    }


    //TEST
    async setRedis() {
        const randomNum = 14
        await this.redis.set('test', randomNum.toString(), 180)
        return { messege: 'Set' }
    }

    async getRedis() {
        const val = await this.redis.get('test');
        return val;
    }
}
