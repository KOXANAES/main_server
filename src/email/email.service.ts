import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter;

  constructor(private readonly mailerService: MailerService) {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async onModuleInit() {
    try {
      await this.transporter.verify();
      console.log("Сервер готов принимать сообщения");
    } catch (error) {
      console.error("Ошибка при проверке соединения с SMTP-сервером:", error);
    }
  }

  public async sendEmail(to: string, activationLink: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.SMTP_USER,
        subject: `Активация аккаунта` + process.env.CLIENT_URL,
        html: `<!DOCTYPE html>
          <html>
          <head>
              <title>Activation Link</title>
          </head>
          <body>
              <p>Ссылка для активации: <a href="${activationLink}">Активировать</a></p>
          </body>
          </html>`,
        context: {
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

