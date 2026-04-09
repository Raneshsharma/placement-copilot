import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}
  async list(userId: string) { return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20 }); }
  async markRead(id: string) { return this.prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } }); }
}
