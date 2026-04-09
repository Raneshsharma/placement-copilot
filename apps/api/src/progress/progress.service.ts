import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}
  async getDashboard(userId: string) {
    const [applications, interviews, profile] = await Promise.all([
      this.prisma.application.findMany({ where: { userId }, include: { job: true } }),
      this.prisma.mockInterview.findMany({ where: { userId } }),
      this.prisma.profile.findUnique({ where: { userId } }),
    ]);
    return { applications, interviews, profileCompleteness: this.calcCompleteness(profile) };
  }
  async getAnalytics(userId: string) {
    const apps = await this.prisma.application.findMany({ where: { userId } });
    const total = apps.length;
    const responseRate = apps.filter(a => a.status !== 'SUBMITTED').length / Math.max(total, 1);
    const offerRate = apps.filter(a => a.status === 'OFFERED').length / Math.max(total, 1);
    return { totalApplications: total, responseRate: Math.round(responseRate * 100), offerRate: Math.round(offerRate * 100) };
  }
  async getTimeline(userId: string) {
    const apps = await this.prisma.application.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
    return apps.map(a => ({ id: a.id, company: a.company, role: a.role, status: a.status, date: a.createdAt }));
  }
  private calcCompleteness(profile: any) { if (!profile) return 0; let score = 0; if (profile.skills?.length) score += 20; if (profile.experience?.length) score += 20; if (profile.education?.length) score += 20; return score; }
}
