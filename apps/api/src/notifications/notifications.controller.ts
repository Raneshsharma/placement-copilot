import { Controller, Get, Patch, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Get() list(@Req() req: any) { return this.notificationsService.list(req.user.userId); }
  @Patch(':id/read') read(@Param('id') id: string) { return this.notificationsService.markRead(id); }
  @Post('register') register(@Body() dto: any) { return { message: 'Push registration noted' }; }
}
