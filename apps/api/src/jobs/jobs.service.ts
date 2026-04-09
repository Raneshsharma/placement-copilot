import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}
  async list(q: any) { return this.prisma.jobListing.findMany({ where: { status: 'ACTIVE' }, take: q.limit || 20, skip: q.skip || 0, orderBy: { postedAt: 'desc' } }); }
  async search(q: any) {
    const where: any = { status: 'ACTIVE' };
    if (q.query) { where.OR = [{ title: { contains: q.query, mode: 'insensitive' } }, { company: { contains: q.query, mode: 'insensitive' } }]; }
    if (q.location) { where.location = { contains: q.location, mode: 'insensitive' } }; // For MVP — in production use Elasticsearch
    return this.prisma.jobListing.findMany({ where, take: 20, orderBy: { postedAt: 'desc' } });
  }
  async findById(id: string) { return this.prisma.jobListing.findUnique({ where: { id } }); }
  async save(userId: string, dto: any) { return this.prisma.jobListing.create({ data: { ...dto, status: 'ACTIVE' } }); } // Simplified for MVP
  async unsave(id: string) { return this.prisma.jobListing.delete({ where: { id } }); }
}
