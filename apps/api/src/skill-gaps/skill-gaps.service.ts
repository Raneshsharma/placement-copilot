import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { AnalyzeSkillGapDto } from './dto/analyze-skill-gap.dto';

@Injectable()
export class SkillGapsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async analyze(userId: string, dto: AnalyzeSkillGapDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const currentSkills = dto.currentSkills || (profile?.skills as string[]) || [];

    let aiResult: any;
    try {
      aiResult = await this.aiService.analyzeSkillGap({
        targetRole: dto.targetRole,
        currentSkills,
      });
    } catch {
      aiResult = {
        data: {
          gaps: [
            { skill: 'Unknown', gap: 30, priority: 'Medium', current: 50, target: 80 },
          ],
          recommendations: [],
          roadmap: [],
          priorityScore: 50,
        },
      };
    }

    const data = aiResult.data || {};

    const analysis = await this.prisma.skillGapAnalysis.create({
      data: {
        userId,
        targetRole: dto.targetRole,
        currentSkills,
        gaps: data.gaps || [],
        roadmap: data.roadmap || [],
        recommendations: data.recommendations || [],
        priorityScore: data.priorityScore || 0,
      },
    });

    return { ...analysis, recommendations: data.recommendations || [] };
  }

  async getCurrent(userId: string) {
    const latest = await this.prisma.skillGapAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!latest) {
      const profile = await this.prisma.profile.findUnique({ where: { userId } });
      return {
        analysis: null,
        profileCompleteness: profile?.completeness || 0,
        message: 'No analysis found. Run /api/skill-gaps/analyze to generate one.',
      };
    }
    return latest;
  }

  async getRecommendations(userId: string) {
    const latest = await this.prisma.skillGapAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return {
      recommendations: latest?.recommendations || [],
      gaps: latest?.gaps || [],
      roadmap: latest?.roadmap || [],
      priorityScore: latest?.priorityScore || 0,
    };
  }

  async getHistory(userId: string, targetRole?: string) {
    const where: any = { userId };
    if (targetRole) where.targetRole = targetRole;
    return this.prisma.skillGapAnalysis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
