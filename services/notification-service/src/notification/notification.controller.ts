import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

interface MatchFoundPayload {
  recipientEmail: string;
  opponent: {
    email: string;
    level: string;
    sport: string;
    location: string;
    dateTimeStart: string;
    dateTimeEnd: string;
  };
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('matches.matched')
  async handleMatchFound(@Payload() data: MatchFoundPayload) {
    const { recipientEmail, opponent } = data;
    const subject = 'You have a new match on PlayPal!';
    const html = this.notificationService.generateMatchEmailHtml(opponent);
    await this.notificationService.sendEmail(recipientEmail, subject, html);
  }
}
