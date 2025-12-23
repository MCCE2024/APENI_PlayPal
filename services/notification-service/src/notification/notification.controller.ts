import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('matches.matched')
  async handleMatchFound(
    @Payload() data: { to: string; subject: string; html: string },
  ) {
    const { to, subject, html } = data;
    await this.notificationService.sendEmail(to, subject, html);
  }
}
