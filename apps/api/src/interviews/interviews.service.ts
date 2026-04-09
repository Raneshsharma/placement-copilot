import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}
  async start(userId: string, dto: any) { return this.prisma.mockInterview.create({ data: { userId, type: dto.type || 'TECHNICAL', status: 'SETUP' } }); }
  async list(userId: string) { return this.prisma.mockInterview.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
  async findById(id: string) { return this.prisma.mockInterview.findUnique({ where: { id } }); }
  async answer(id: string, dto: any) { return this.prisma.mockInterview.update({ where: { id }, data: { answers: { push: dto.answer }, status: 'IN_PROGRESS' } }); }
  async getFeedback(id: string) { const interview = await this.findById(id); return this.aiService.startInterview({ sessionId: id, ...interview }); }
}
