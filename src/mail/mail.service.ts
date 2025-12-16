import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });
    }

    async sendMail(options: {
        to: string;
        subject: string;
        html: string;
    }) {
        try {
        const info = await this.transporter.sendMail({
            from: `"MoonlorAI" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        return info;
        } catch (err) {
        console.error('Mail send error:', err);
        throw new InternalServerErrorException('Не вдалося відправити електронний лист' );
        }
    }


    async sendResetCode(email: string, code: string) {
        console.log(email,code)
        const html = `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px;">
            <h2 style="color:#4b3cc9;">MoonlorAI – восстановление доступа</h2>
            <p>Ваш код для сброса пароля:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
            <p style="font-size: 12px; color:#666;">Код діє 3 хвилини. Якщо ви не запитували код, тоді проігноруйте це повідомлення.</p>
        </div>
        `;

        return this.sendMail({
        to: email,
        subject: 'MoonlorAI – код для відновлення пароля',
        html,
        });
    }

}
