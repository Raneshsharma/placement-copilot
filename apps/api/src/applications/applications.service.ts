import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}
  async list(userId: string) { return this.prisma.application.findMany({ where: { userId }, include: { job: true }, orderBy: { createdAt: 'desc' } }); }
  async create(userId: string, dto: any) {
    return this.prisma.application.create({
      data: { userId, status: dto.status || 'DRAFT', company: dto.company, role: dto.role, timeline: [{ status: dto.status || 'DRAFT', timestamp: new Date().toISOString() }] },
    });
  }
  async update(id: string, dto: any) {
    const current = await this.prisma.application.findUnique({ where: { id } });
    const timeline = [...(current?.timeline || []), { status: dto.status, timestamp: new Date().toISOString() }];
    return this.prisma.application.update({ where: { id }, data: { ...dto, lastStatusUpdate: new Date(), timeline } });
  }
  async getTimeline(id: string) { const a = await this.prisma.application.findUnique({ where: { id }, select: { timeline: true } }); return a?.timeline || []; }
  async delete(id: string) { return this.prisma.application.delete({ where: { id } }); }
}
