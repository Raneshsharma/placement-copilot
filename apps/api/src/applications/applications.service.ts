import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { isValidTransition } from '../common/constants/status-transitions';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { userId },
        include: { jobListing: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.application.count({ where: { userId } }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async create(userId: string, dto: any) {
    const timeline = [
      { status: dto.status || ApplicationStatus.DRAFT, timestamp: new Date().toISOString(), note: 'Application created' },
    ];
    return this.prisma.application.create({
      data: {
        userId,
        jobListingId: dto.jobListingId || null,
        resumeId: dto.resumeId || null,
        company: dto.company,
        position: dto.position,
        status: dto.status || ApplicationStatus.DRAFT,
        appliedAt: dto.appliedAt || null,
        timeline,
        coverLetterUrl: dto.coverLetterUrl || null,
        notes: dto.notes || null,
      },
    });
  }

  async findById(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { jobListing: true, interviews: true },
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async update(id: string, dto: any) {
    const current = await this.prisma.application.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Application not found');

    // Validate status transition
    if (dto.status && dto.status !== current.status) {
      if (!isValidTransition(current.status, dto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${current.status} to ${dto.status}`,
        );
      }
    }

    const timeline = [
      ...((current.timeline as any[]) || []),
      {
        status: dto.status || current.status,
        timestamp: new Date().toISOString(),
        note: dto.note || null,
      },
    ];

    return this.prisma.application.update({
      where: { id },
      data: {
        ...dto,
        timeline,
        appliedAt: dto.status === ApplicationStatus.SUBMITTED && !current.appliedAt ? new Date() : current.appliedAt,
      },
    });
  }

  async updateStatus(id: string, dto: { status: ApplicationStatus; note?: string }) {
    return this.update(id, dto);
  }

  async addNote(id: string, note: string) {
    const current = await this.prisma.application.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Application not found');
    const notes = current.notes ? `${current.notes}\n---\n${note}` : note;
    const timeline = [
      ...((current.timeline as any[]) || []),
      { status: current.status, timestamp: new Date().toISOString(), note },
    ];
    return this.prisma.application.update({
      where: { id },
      data: { notes, timeline },
    });
  }

  async getTimeline(id: string) {
    const a = await this.prisma.application.findUnique({
      where: { id },
      select: { timeline: true },
    });
    return (a?.timeline as any[]) || [];
  }

  async delete(id: string) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) throw new NotFoundException('Application not found');
    return this.prisma.application.delete({ where: { id } });
  }

  async getStats(userId: string) {
    const apps = await this.prisma.application.findMany({ where: { userId } });
    const total = apps.length;
    const byStatus = apps.reduce((acc: Record<string, number>, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, byStatus };
  }
}
