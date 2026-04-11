import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async upload(userId: string, file: Express.Multer.File, dto: { title?: string } = {}) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const ext = path.extname(file.originalname);
    // Sanitize extension to prevent path traversal via filename
    const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${fileHash}.${safeExt}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    // Check for existing same file
    const existing = await this.prisma.resume.findFirst({ where: { userId, fileKey: fileName } });
    if (existing) {
      return existing;
    }

    // Unset primary if this will be primary
    const isPrimary = !await this.prisma.resume.findFirst({ where: { userId, isPrimary: true } });

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        title: dto.title || file.originalname,
        fileKey: fileName,
        fileUrl: `/uploads/resumes/${fileName}`,
        isPrimary,
        version: 1,
      },
    });

    // Trigger AI parsing asynchronously
    this.parseResume(resume.id, filePath).catch(console.error);

    return resume;
  }

  private async parseResume(resumeId: string, filePath: string) {
    try {
      const analysis = await this.aiService.optimizeResume({ resumeId, filePath });
      await this.prisma.resume.update({
        where: { id: resumeId },
        data: {
          parsedData: analysis.data || {},
          atsScore: analysis.data?.atsCompatibility || null,
        },
      });
    } catch {
      // Parsing failed, resume saved without parsed data
    }
  }

  async list(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    return resume;
  }

  async findByIdForUser(id: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException('Not authorized to access this resume');
    return resume;
  }

  async deleteForUser(id: string, userId: string) {
    const resume = await this.findByIdForUser(id, userId);
    // Delete file
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    const filePath = path.join(uploadDir, resume.fileKey || '');
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return this.prisma.resume.delete({ where: { id } });
  }

  async setPrimary(id: string, userId: string) {
    const resume = await this.findByIdForUser(id, userId);
    await this.prisma.resume.updateMany({ where: { userId }, data: { isPrimary: false } });
    return this.prisma.resume.update({ where: { id }, data: { isPrimary: true } });
  }

  async analyzeForUser(id: string, userId: string) {
    const resume = await this.findByIdForUser(id, userId);
    return this.aiService.optimizeResume({ resumeId: id, resumeData: resume.parsedData });
  }

  async optimizeForUser(id: string, userId: string, dto: { targetRole: string; targetCompanies?: string[] }) {
    const resume = await this.findByIdForUser(id, userId);
    return this.aiService.optimizeResume({ resumeId: id, resumeData: resume.parsedData, ...dto });
  }

  async delete(id: string) {
    const resume = await this.findById(id);
    // Delete file
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    const filePath = path.join(uploadDir, resume.fileKey || '');
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return this.prisma.resume.delete({ where: { id } });
  }

  async optimize(id: string, dto: { targetRole: string; targetCompanies?: string[] }) {
    const resume = await this.findById(id);
    return this.aiService.optimizeResume({ resumeId: id, resumeData: resume.parsedData, ...dto });
  }
}
