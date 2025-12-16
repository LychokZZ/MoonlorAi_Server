import { Controller, Post, Body, Get ,Query, Res, Req} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { sendCode } from './dto/restor.dto/restore.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Post('register')
    async register(@Body()  dto: RegisterDto , @Res() res: Response){
        const data = await this.authService.register(dto)

        res.cookie('refresh_token', data.tokens.refresh_token, {
            httpOnly: true,
            secure:false, // on prod true
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return res.json({
            Messege : data.messeges,
            userData: data.userData,
            access_token: data.tokens.access_token
        })
    }
    @Post('login')
    async login(@Body() dto: LoginDto , @Res() res: Response){
        const data = await this.authService.login(dto)

        res.cookie('refresh_token', data.tokens.refresh_token, {
            httpOnly: true,
            secure:false, // on prod true
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return res.json({
            Messege : data.messeges,
            userData: data.userData,
            access_token: data.tokens.access_token
        })
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refresh = req.cookies['refresh_token'];
        if (!refresh) {
            return res.status(401).json({ message: 'No refresh cookie' });
        }

        const data = await this.authService.refreshToken(refresh);

        res.cookie('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: false, // on prod true
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return res.json({ access_token: data.access_token });
    }

    @Post('logout')
    async logout(@Req() req, @Res() res: Response) {
        const data = await this.authService.logout(req.user.userId);

        res.clearCookie('refresh_token');

        return res.json({ message: data.message });
    }


    @Post('generateCode')
    async resetPassword_generate(@Body() email: string ,@Res() res: Response){
        const data = await this.authService.resetPassword_generate(email)

        return res.json({ message: data.message });
    }

    @Post('sendCode')
    async resetPassword_send(@Body() dto: sendCode ,@Res() res: Response){
        const data = await this.authService.resetPassword_send(dto)

        return res.json({ message: data.message });
    }


    //test

    @Post('hi')
    async hi() {
        return {message: 'hi'}
    }
    @Post('post-redis')
    async postRedis() {
        return this.authService.setRedis();
    }

    @Get('get-redis')
    async getRedis() {
        return this.authService.getRedis();
    }
}
