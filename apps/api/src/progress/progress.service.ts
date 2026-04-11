import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async getPPS(userId: string) {
    const [profile, resumes, applications, interviews] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId } }),
      this.prisma.resume.findMany({ where: { userId } }),
      this.prisma.application.findMany({ where: { userId } }),
      this.prisma.mockInterview.findMany({ where: { userId } }),
    ]);

    // Profile completeness: % of profile fields filled
    const profileFields = [
      profile?.headline, profile?.summary, profile?.experience,
      profile?.education, profile?.skills, profile?.certifications,
      profile?.projects, profile?.location, profile?.phone, profile?.portfolioUrl,
    ];
    const filledFields = profileFields.filter(Boolean).length;
    const profileCompleteness = Math.round((filledFields / 10) * 100);

    // Resume quality: ATS score (0 if no resume)
    const primaryResume = resumes.find((r) => r.isPrimary) || resumes[0];
    const resumeQuality = primaryResume?.atsScore ? Math.round(primaryResume.atsScore) : 0;

    // Skills match: % of required skills for target role
    const targetRole = profile?.headline || 'Software Engineer';
    const userSkills = new Set((profile?.skills as string[]) || []);
    const requiredSkills = this.getRequiredSkillsForRole(targetRole);
    const matchedSkills = requiredSkills.filter((s) =>
      Array.from(userSkills).some(
        (us) => us.toLowerCase() === s.toLowerCase() || us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()),
      ),
    );
    const skillsMatch = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    // Activity level: min(100, applicationsLast30Days × 10)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApps = applications.filter(
      (a) => a.status !== ApplicationStatus.DRAFT && new Date(a.createdAt) >= thirtyDaysAgo,
    ).length;
    const activityLevel = Math.min(100, recentApps * 10);

    // PPS formula
    const pps = Math.round(
      profileCompleteness * 0.25 + resumeQuality * 0.35 + skillsMatch * 0.25 + activityLevel * 0.15,
    );

    // Check for missing data and add estimated flag
    const hasProfile = !!profile;
    const hasResume = resumes.length > 0;
    const hasSkills = (profile?.skills as string[])?.length > 0;
    const estimated = !hasProfile || !hasResume;

    // Stats
    const activeApplications = applications.filter(
      (a) => a.status !== ApplicationStatus.REJECTED && a.status !== ApplicationStatus.WITHDRAWN,
    ).length;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const interviewsThisMonth = interviews.filter(
      (i) => i.completedAt && new Date(i.completedAt) >= startOfMonth,
    ).length;

    const offersReceived = applications.filter((a) => a.status === ApplicationStatus.OFFERED).length;

    const responseRate = applications.length > 0
      ? Math.round(
          (applications.filter(
            (a) =>
              a.status !== ApplicationStatus.DRAFT &&
              a.status !== ApplicationStatus.SUBMITTED &&
              a.status !== ApplicationStatus.REJECTED &&
              a.status !== ApplicationStatus.WITHDRAWN,
          ).length /
            applications.length) *
            100,
        )
      : 0;

    return {
      ppsScore: pps,
      estimated,
      breakdown: {
        profileCompleteness,
        resumeQuality,
        skillsMatch,
        activityLevel,
      },
      stats: {
        activeApplications,
        interviewsThisMonth,
        offersReceived,
        responseRate,
      },
    };
  }

  private getRequiredSkillsForRole(role: string): string[] {
    const roleSkills: Record<string, string[]> = {
      default: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker'],
      'Software Engineer': ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'TypeScript', 'System Design'],
      'Product Manager': ['Communication', 'Data Analysis', 'Agile', 'Roadmapping', 'Leadership'],
      'Data Scientist': ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Data Visualization'],
    };
    return roleSkills[role] || roleSkills['Software Engineer'];
  }

  async getDashboard(userId: string) {
    const [applications, interviews, profile, resumes] = await Promise.all([
      this.prisma.application.findMany({ where: { userId } }),
      this.prisma.mockInterview.findMany({ where: { userId } }),
      this.prisma.profile.findUnique({ where: { userId } }),
      this.prisma.resume.findMany({ where: { userId } }),
    ]);

    const totalApplications = applications.length;
    const submittedApplications = applications.filter((a) => a.status !== ApplicationStatus.DRAFT).length;
    const responseRate = totalApplications > 0
      ? Math.round((applications.filter((a) => a.status !== ApplicationStatus.DRAFT && a.status !== ApplicationStatus.SUBMITTED).length / totalApplications) * 100)
      : 0;
    const interviewCount = interviews.filter((i) => i.status === 'COMPLETED' || i.status === 'FEEDBACK_READY').length;
    const offerCount = applications.filter((a) => a.status === ApplicationStatus.OFFERED).length;
    const offerRate = totalApplications > 0 ? Math.round((offerCount / totalApplications) * 100) : 0;

    const completedInterviews = interviews.filter((i) => i.status === 'COMPLETED' || i.status === 'FEEDBACK_READY');
    const avgInterviewScore = completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((sum: number, i: any) => {
            const scores = i.scores as any || {};
            const vals = Object.values(scores).filter((v: any) => typeof v === 'number');
            return sum + (vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0);
          }, 0) / completedInterviews.length,
        )
      : 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyApplications = applications.filter((a) => new Date(a.createdAt) >= weekAgo).length;
    const weeklyInterviews = interviews.filter((i) => i.startedAt && new Date(i.startedAt) >= weekAgo).length;

    const applicationStatuses = applications.reduce((acc: Record<string, number>, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentApplications = await this.prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { jobListing: true },
    });

    return {
      totalApplications,
      submittedApplications,
      responseRate,
      interviewCount,
      offerCount,
      offerRate,
      ppsScore: profile?.ppsScore || null,
      avgInterviewScore,
      profileCompleteness: profile?.completeness || 0,
      resumeCount: resumes.length,
      weeklyActivity: {
        applications: weeklyApplications,
        interviews: weeklyInterviews,
      },
      applicationStatuses,
      recentApplications,
      milestones: {
        profileCreated: !!profile,
        hasResume: resumes.length > 0,
        firstApplication: totalApplications > 0,
        firstInterview: interviewCount > 0,
        firstOffer: offerCount > 0,
      },
    };
  }

  async getAnalytics(userId: string) {
    const applications = await this.prisma.application.findMany({ where: { userId } });
    const interviews = await this.prisma.mockInterview.findMany({ where: { userId } });

    const total = applications.length;
    const byStatus = applications.reduce((acc: Record<string, number>, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter((i) => i.status === 'COMPLETED' || i.status === 'FEEDBACK_READY').length;
    const avgScore = completedInterviews > 0
      ? Math.round(
          interviews
            .filter((i) => i.status === 'COMPLETED' || i.status === 'FEEDBACK_READY')
            .reduce((sum: number, i: any) => {
              const scores = i.scores as any || {};
              const vals = Object.values(scores).filter((v: any) => typeof v === 'number');
              return sum + (vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : 0);
            }, 0) / completedInterviews,
        )
      : 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyActivity = applications
      .filter((a) => new Date(a.createdAt) >= weekAgo)
      .map((a) => ({ date: a.createdAt, type: 'application' } as { date: Date; type: string }))
      .concat(
        interviews
          .filter((i) => i.startedAt && new Date(i.startedAt) >= weekAgo)
          .map((i) => ({ date: i.startedAt!, type: 'interview' } as { date: Date; type: string })),
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      totalApplications: total,
      submittedApplications: applications.filter((a) => a.status !== ApplicationStatus.DRAFT).length,
      interviewCount: totalInterviews,
      completedInterviews,
      avgInterviewScore: avgScore,
      responseRate: total > 0
        ? Math.round(
            (applications.filter((a) => a.status !== ApplicationStatus.DRAFT && a.status !== ApplicationStatus.SUBMITTED).length / total) * 100,
          )
        : 0,
      offerRate: total > 0
        ? Math.round((applications.filter((a) => a.status === ApplicationStatus.OFFERED).length / total) * 100)
        : 0,
      byStatus,
      weeklyActivity,
    };
  }

  async getTimeline(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return applications.map((a) => ({
      id: a.id,
      company: a.company,
      position: a.position,
      status: a.status,
      date: a.createdAt,
      appliedAt: a.appliedAt,
    }));
  }
}
