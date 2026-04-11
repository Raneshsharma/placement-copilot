import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async findById(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async findOrCreate(userId: string) {
    let profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await this.prisma.profile.create({ data: { userId } });
    }
    return profile;
  }

  async create(userId: string, dto: CreateProfileDto) {
    const existing = await this.prisma.profile.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException('Profile already exists');
    const completeness = this.calculateCompleteness(dto);
    return this.prisma.profile.create({
      data: { ...dto, userId, completeness },
    });
  }

  async update(id: string, dto: UpdateProfileDto) {
    // Try by profile id first, then by userId
    let existing = await this.prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      existing = await this.prisma.profile.findUnique({ where: { userId: id } });
    }
    if (!existing) throw new NotFoundException('Profile not found');
    const merged = { ...existing, ...dto };
    const completeness = this.calculateCompleteness(merged);
    return this.prisma.profile.update({
      where: { id: existing.id },
      data: { ...dto, completeness },
    });
  }

  async upsert(userId: string, dto: CreateProfileDto) {
    const existing = await this.prisma.profile.findUnique({ where: { userId } });
    const completeness = this.calculateCompleteness(dto);
    if (existing) {
      return this.prisma.profile.update({
        where: { userId },
        data: { ...dto, completeness },
      });
    }
    return this.prisma.profile.create({ data: { ...dto, userId, completeness } });
  }

  async getAnalysis(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return this.aiService.analyzeProfile({ profile });
  }

  calculateCompleteness(profile: any): number {
    const fields = [
      !!profile.headline,
      !!profile.summary,
      Array.isArray(profile.skills) && profile.skills.length > 0,
      Array.isArray(profile.experience) && profile.experience.length > 0,
      Array.isArray(profile.education) && profile.education.length > 0,
      Array.isArray(profile.certifications) && profile.certifications.length > 0,
      !!profile.location,
      !!profile.phone,
      !!profile.linkedinUrl,
      !!profile.githubUrl,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }
}
