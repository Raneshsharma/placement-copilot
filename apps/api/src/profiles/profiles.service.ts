import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}
  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }
  async create(userId: string, dto: any) { return this.prisma.profile.create({ data: { ...dto, userId } }); }
  async update(id: string, dto: any) { return this.prisma.profile.update({ where: { id }, data: dto }); }
  async getAnalysis(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return this.aiService.analyzeProfile({ profile });
  }
}
