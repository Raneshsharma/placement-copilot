import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return {
      items,
      unreadCount,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markRead(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { markedRead: result.count };
  }

  async create(userId: string, dto: { type: NotificationType; title: string; message: string; payload?: any }) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        payload: dto.payload || {},
      },
    });
  }

  async delete(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
