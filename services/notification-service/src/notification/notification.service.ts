import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = process.env.RESEND_API_KEY;
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    let from_mail = process.env.FROM_MAIL;
    if (!from_mail) {
      from_mail = 'onboarding@resend.dev';
    }
    try {
      const { data, error } = await this.resend.emails.send({
        from: from_mail,
        to,
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
