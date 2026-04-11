import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: { email: string; password?: string; firstName: string; lastName: string }) {
    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
    return this.prisma.user.create({
      data: { email: data.email, password: passwordHash, firstName: data.firstName, lastName: data.lastName },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });
  }

  async update(id: string, dto: UpdateMeDto) {
    // Fetch user to check existence
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const data: any = { ...dto };
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          select: {
            headline: true,
            summary: true,
            skills: true,
            location: true,
            phone: true,
            portfolioUrl: true,
            linkedinUrl: true,
            completeness: true,
            ppsScore: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      headline: user.profile?.headline,
      summary: user.profile?.summary,
      skills: user.profile?.skills as string[],
      location: user.profile?.location,
      phone: user.profile?.phone,
      portfolioUrl: user.profile?.portfolioUrl,
      linkedinUrl: user.profile?.linkedinUrl,
      completeness: user.profile?.completeness,
      ppsScore: user.profile?.ppsScore,
    };
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Build user update data
    const userData: any = {};
    if (dto.firstName !== undefined) userData.firstName = dto.firstName;
    if (dto.lastName !== undefined) userData.lastName = dto.lastName;

    // Profile fields
    const profileData: any = {};
    if (dto.phone !== undefined) profileData.phone = dto.phone;
    if (dto.location !== undefined) profileData.location = dto.location;
    if (dto.linkedIn !== undefined) profileData.linkedinUrl = dto.linkedIn;
    if (dto.portfolioUrl !== undefined) profileData.portfolioUrl = dto.portfolioUrl;
    if (dto.targetRole !== undefined) profileData.headline = dto.targetRole;
    if (dto.industry !== undefined) profileData.headline = (dto.targetRole || '') + ' in ' + dto.industry;
    if (dto.experienceYears !== undefined) profileData.experience = JSON.stringify([{ years: dto.experienceYears }]);
    if (dto.bio !== undefined) profileData.summary = dto.bio;

    const [updatedUser] = await this.prisma.$transaction([
      userData.firstName || userData.lastName
        ? this.prisma.user.update({ where: { id: userId }, data: userData })
        : this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (Object.keys(profileData).length > 0) {
      await this.prisma.profile.upsert({
        where: { userId },
        update: profileData,
        create: { userId, ...profileData },
      });
    }

    return this.getMe(userId);
  }

  async getNotificationPreferences(userId: string) {
    const prefs = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    // Return default preferences if none exist
    return {
      applicationUpdates: true,
      interviewReminders: true,
      newJobRecommendations: true,
      skillGapInsights: false,
      tipsAndTricks: false,
    };
  }

  async updateNotificationPreferences(userId: string, dto: UpdateNotificationsDto) {
    // Store preferences in analytics or a preferences model
    // For now, create a system notification recording the preferences
    return {
      applicationUpdates: dto.applicationUpdates ?? true,
      interviewReminders: dto.interviewReminders ?? true,
      newJobRecommendations: dto.newJobRecommendations ?? true,
      skillGapInsights: dto.skillGapInsights ?? false,
      tipsAndTricks: dto.tipsAndTricks ?? false,
    };
  }

  async uploadAvatar(userId: string, filePath: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.profile.upsert({
      where: { userId },
      update: { websiteUrl: filePath },
      create: { userId, websiteUrl: filePath },
    });

    return { avatarUrl: filePath };
  }

  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        resumes: true,
        applications: { include: { jobListing: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const savedJobs = await this.prisma.savedJob.findMany({ where: { userId } });
    const interviews = await this.prisma.mockInterview.findMany({ where: { userId } });
    const notifications = await this.prisma.notification.findMany({ where: { userId } });

    return {
      profile: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
        ...user.profile,
      },
      resumes: user.resumes,
      applications: user.applications,
      savedJobs,
      interviewSessions: interviews,
      notifications,
    };
  }

  async softDelete(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Invalidate refresh tokens
    await this.prisma.refreshToken.deleteMany({ where: { userId } });

    // Soft delete user
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { message: 'Account deleted successfully' };
  }
}
