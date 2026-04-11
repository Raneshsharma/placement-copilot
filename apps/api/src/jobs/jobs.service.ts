import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async list(q: SearchJobsDto & { page?: number; limit?: number }) {
    const page = q.page || 1;
    const limit = Math.min(q.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { status: 'ACTIVE' };
    if (q.location) where.location = { contains: q.location, mode: 'insensitive' };
    if (q.locationType) where.locationType = q.locationType;
    if (q.source) where.source = q.source;
    if (q.skills?.length) where.keywords = { hasSome: q.skills };

    const [items, total] = await Promise.all([
      this.prisma.jobListing.findMany({
        where,
        take: limit,
        skip,
        orderBy: { postedAt: 'desc' },
      }),
      this.prisma.jobListing.count({ where }),
    ]);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async search(q: SearchJobsDto) {
    const where: any = { status: 'ACTIVE' };
    if (q.query) {
      where.OR = [
        { title: { contains: q.query, mode: 'insensitive' } },
        { company: { contains: q.query, mode: 'insensitive' } },
        { description: { contains: q.query, mode: 'insensitive' } },
        { keywords: { hasSome: [q.query.toLowerCase()] } },
      ];
    }
    if (q.location) where.location = { contains: q.location, mode: 'insensitive' };
    if (q.locationType) where.locationType = q.locationType;
    if (q.source) where.source = q.source;
    if (q.skills?.length) where.keywords = { hasSome: q.skills };
    if (q.page && q.limit) {
      const skip = (q.page - 1) * q.limit;
      return this.prisma.jobListing.findMany({ where, take: q.limit, skip, orderBy: { postedAt: 'desc' } });
    }
    return this.prisma.jobListing.findMany({ where, take: 20, orderBy: { postedAt: 'desc' } });
  }

  async findById(id: string) {
    const job = await this.prisma.jobListing.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async recommended(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return this.prisma.jobListing.findMany({
        where: { status: 'ACTIVE' },
        take: 10,
        orderBy: { postedAt: 'desc' },
      });
    }
    const skills: string[] = profile.skills as string[] || [];
    const experience: any[] = profile.experience as any[] || [];
    const jobTitles = experience.map((e: any) => e.title).filter(Boolean);
    const searchTerms = [...jobTitles, ...skills.slice(0, 5)];

    const where: any = {
      status: 'ACTIVE',
      OR: searchTerms.map((term) => ({
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { keywords: { hasSome: [term.toLowerCase()] } },
          { requirements: { hasSome: [term] } },
        ],
      })),
    };

    const jobs = await this.prisma.jobListing.findMany({
      where,
      take: 10,
      orderBy: { postedAt: 'desc' },
    });

    if (jobs.length < 5) {
      const fallback = await this.prisma.jobListing.findMany({
        where: { status: 'ACTIVE', id: { notIn: jobs.map((j) => j.id) } },
        take: 10 - jobs.length,
        orderBy: { postedAt: 'desc' },
      });
      return [...jobs, ...fallback];
    }

    return jobs;
  }

  async save(userId: string, dto: CreateJobDto) {
    // If jobListingId is provided, save the existing job
    if ((dto as any).jobListingId) {
      const job = await this.prisma.jobListing.findUnique({ where: { id: (dto as any).jobListingId } });
      if (!job) throw new NotFoundException('Job not found');
      return this.prisma.savedJob.upsert({
        where: { userId_jobId: { userId, jobId: job.id } },
        create: { userId, jobId: job.id },
        update: {},
      });
    }
    // Otherwise create a new job listing and save it
    const job = await this.prisma.jobListing.create({
      data: {
        title: dto.title || 'Untitled Job',
        company: dto.company || 'Unknown Company',
        location: dto.location || '',
        description: dto.description || '',
        status: 'ACTIVE',
        source: 'INTERNAL',
        locationType: dto.locationType,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
      },
    });
    return this.prisma.savedJob.create({ data: { userId, jobId: job.id } });
  }

  async update(id: string, dto: UpdateJobDto) {
    return this.prisma.jobListing.update({ where: { id }, data: dto });
  }

  async unsave(id: string) {
    try {
      // Verify the saved job exists first
      const savedJob = await this.prisma.savedJob.findUnique({ where: { id } });
      if (!savedJob) throw new NotFoundException('Saved job not found');
      await this.prisma.savedJob.delete({ where: { id } });
      return { id, deleted: true, message: 'Saved job removed' };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      return { id, deleted: false, message: 'Saved job not found' };
    }
  }

  async getSavedJobs(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const savedJobs = await this.prisma.savedJob.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
      take: limit,
      skip,
    });
    return savedJobs;
  }
}
