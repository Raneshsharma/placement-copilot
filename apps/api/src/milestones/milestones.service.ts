import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

const STATUS_COLORS: Record<string, string> = {
  [ApplicationStatus.SUBMITTED]: '#3b82f6',
  [ApplicationStatus.UNDER_REVIEW]: '#f59e0b',
  [ApplicationStatus.INTERVIEW]: '#8b5cf6',
  [ApplicationStatus.OFFERED]: '#10b981',
  [ApplicationStatus.REJECTED]: '#ef4444',
  [ApplicationStatus.WITHDRAWN]: '#6b7280',
  [ApplicationStatus.DRAFT]: '#9ca3af',
};

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async getRecent(userId: string, limit = 5) {
    const [applications, interviews, savedJobs] = await Promise.all([
      this.prisma.application.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: limit,
      }),
      this.prisma.mockInterview.findMany({
        where: { userId, status: { in: ['COMPLETED', 'FEEDBACK_READY'] } },
        orderBy: { completedAt: 'desc' },
        take: limit,
      }),
      this.prisma.savedJob.findMany({
        where: { userId },
        orderBy: { savedAt: 'desc' },
        take: limit,
      }),
    ]);

    const jobIds = savedJobs.map((s) => s.jobId);
    const jobs = await this.prisma.jobListing.findMany({ where: { id: { in: jobIds } } });
    const jobsMap = new Map(jobs.map((j) => [j.id, j]));

    const milestones: any[] = [];

    // Application status changes
    for (const app of applications) {
      milestones.push({
        id: app.id,
        type: 'application',
        title: `Application: ${app.position} at ${app.company}`,
        timestamp: app.updatedAt,
        statusColor: STATUS_COLORS[app.status] || '#6b7280',
        status: app.status,
      });
    }

    // Interview completions
    for (const interview of interviews) {
      const typeLabels: Record<string, string> = {
        BEHAVIORAL: 'Behavioral',
        TECHNICAL: 'Technical',
        CASE_STUDY: 'Case Study',
        SYSTEM_DESIGN: 'System Design',
        HYBRID: 'Mixed',
      };
      milestones.push({
        id: interview.id,
        type: 'interview',
        title: `${typeLabels[interview.type] || interview.type} interview completed`,
        timestamp: interview.completedAt || interview.updatedAt,
        statusColor: '#8b5cf6',
        status: interview.status,
      });
    }

    // Saved jobs
    for (const saved of savedJobs) {
      const job = jobsMap.get(saved.jobId);
      milestones.push({
        id: saved.id,
        type: 'savedJob',
        title: `Saved job: ${job?.title || 'Job'}`,
        timestamp: saved.savedAt,
        statusColor: '#ec4899',
        status: 'SAVED',
      });
    }

    // Sort by timestamp descending and take top N
    return milestones
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}
