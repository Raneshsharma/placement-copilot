import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedJobsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    const saved = await this.prisma.savedJob.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
    });
    const jobIds = saved.map((s) => s.jobId);
    const jobs = await this.prisma.jobListing.findMany({
      where: { id: { in: jobIds } },
    });
    const jobsMap = new Map(jobs.map((j) => [j.id, j]));
    return saved.map((s) => ({
      id: s.id,
      jobId: s.jobId,
      savedAt: s.savedAt,
      job: jobsMap.get(s.jobId) || null,
    }));
  }

  async create(userId: string, jobId: string) {
    const existing = await this.prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (existing) throw new ConflictException('Job already saved');

    const saved = await this.prisma.savedJob.create({
      data: { userId, jobId },
    });
    return { id: saved.id, jobId: saved.jobId, savedAt: saved.savedAt };
  }

  async delete(userId: string, id: string) {
    const saved = await this.prisma.savedJob.findUnique({ where: { id } });
    if (!saved) throw new NotFoundException('Saved job not found');
    if (saved.userId !== userId) throw new NotFoundException('Saved job not found');

    await this.prisma.savedJob.delete({ where: { id } });
    return { message: 'Job unsaved' };
  }

  async findByUserAndJob(userId: string, jobId: string) {
    return this.prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
  }
}
