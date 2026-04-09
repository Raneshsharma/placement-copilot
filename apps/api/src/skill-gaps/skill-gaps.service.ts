import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SkillGapsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}
  async analyze(dto: any) { return this.aiService.analyzeSkillGap(dto); }
}
