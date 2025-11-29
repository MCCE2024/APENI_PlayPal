import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-email')
  async sendEmail(@Body() body: { to: string; subject: string; html: string }) {
    const { to, subject, html } = body;
    return this.notificationService.sendEmail(to, subject, html);
  }
}
