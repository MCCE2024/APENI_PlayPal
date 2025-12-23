import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationService {
  private readonly resend: Resend;
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  generateMatchEmailHtml(opponent: {
    email: string;
    level: string;
    sport: string;
    location: string;
    dateTimeStart: string;
    dateTimeEnd: string;
  }): string {
    return `
      <h1>Match Found!</h1>
      <p>You have been matched for a game of <strong>${opponent.sport}</strong>.</p>
      <p><strong>Opponent:</strong> ${opponent.email} (Level: ${opponent.level})</p>
      <p><strong>Location:</strong> ${opponent.location}</p>
      <p><strong>Time:</strong> ${new Date(opponent.dateTimeStart).toLocaleString()} - ${new Date(opponent.dateTimeEnd).toLocaleTimeString()}</p>
    `;
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.log(`[Local Dev] Email to ${to}: Subject: ${subject}`);
      this.logger.log(`[Local Dev] Body: ${html}`);
      return { id: 'local-mock-id' };
    }

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
}
