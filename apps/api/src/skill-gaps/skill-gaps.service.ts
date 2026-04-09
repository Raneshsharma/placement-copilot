import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SkillGapsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async analyze(userId: string, dto: { targetRole: string; currentSkills?: string[] }) {
    // Get AI analysis
    const aiResult = await this.aiService.analyzeSkillGap({
      targetRole: dto.targetRole,
      currentSkills: dto.currentSkills || [],
    });

    const data = aiResult.data || {};

    // Persist to database
    const analysis = await this.prisma.skillGapAnalysis.create({
      data: {
        userId,
        targetRole: dto.targetRole,
        currentSkills: dto.currentSkills || [],
        gaps: data.gaps || [],
        recommendations: data.recommendations || [],
        roadmap: data.roadmap || [],
        priorityScore: data.priorityScore || 0,
      },
    });

    return analysis;
  }

  async getRecommendations(userId: string) {
    const latest = await this.prisma.skillGapAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return latest?.recommendations || [];
  }

  async getRoadmap(userId: string, targetRole: string) {
    const latest = await this.prisma.skillGapAnalysis.findFirst({
      where: { userId, targetRole },
      orderBy: { createdAt: 'desc' },
    });

    if (latest?.roadmap) {
      return latest.roadmap;
    }

    // Default roadmap for common roles
    const defaultRoadmaps: Record<string, any[]> = {
      'Software Engineer': [
        { week: '1-2', title: 'JavaScript/TypeScript Fundamentals', skills: ['ES6+', 'TypeScript', 'Node.js'] },
        { week: '3-4', title: 'React & Frontend', skills: ['React', 'Next.js', 'CSS'] },
        { week: '5-6', title: 'Backend & APIs', skills: ['REST', 'GraphQL', 'Databases'] },
        { week: '7-8', title: 'System Design', skills: ['Architecture', 'Scaling', 'Caching'] },
      ],
      'default': [
        { week: '1-2', title: 'Foundation Building', skills: ['Core concepts', 'Fundamentals'] },
        { week: '3-4', title: 'Skill Development', skills: ['Practical application', 'Projects'] },
        { week: '5-6', title: 'Advanced Topics', skills: ['Real-world scenarios', 'System design'] },
      ]
    };

    return defaultRoadmaps[targetRole] || defaultRoadmaps['default'];
  }
}
