import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationService {
  private readonly resend: Resend;
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const enableRealEmails =
      this.configService.get<string>('ENABLE_REAL_EMAILS') === 'true';

    // Only enable real email sending in production or if explicitly enabled
    if (apiKey && (nodeEnv === 'production' || enableRealEmails)) {
      this.resend = new Resend(apiKey);
      this.logger.log('Real email sending ENABLED.');
    } else if (apiKey) {
      this.logger.log(
        'Resend API Key found but real email sending is DISABLED (dev mode). Set ENABLE_REAL_EMAILS=true to enable.',
      );
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
    const start = new Date(opponent.dateTimeStart);
    const end = new Date(opponent.dateTimeEnd);

    // Explicitly use CET (Europe/Berlin) and show the timezone to avoid confusion
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short',
    };

    return `
      <h1>Match Found!</h1>
      <p>You have been matched for a game of <strong>${opponent.sport}</strong>.</p>
      <p><strong>Opponent:</strong> ${opponent.email} (Level: ${opponent.level})</p>
      <p><strong>Location:</strong> ${opponent.location}</p>
      <p><strong>Time:</strong> ${start.toLocaleString('en-GB', dateOptions)} - ${end.toLocaleTimeString('en-GB', timeOptions)}</p>
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
