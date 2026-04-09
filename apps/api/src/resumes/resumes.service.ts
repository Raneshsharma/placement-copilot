import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResumesService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async upload(userId: string, file: any) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const ext = path.extname(file.originalname);
    const fileName = `${fileHash}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    return this.prisma.resume.create({
      data: { userId, title: file.originalname, fileKey: fileName },
    });
  }

  async list(userId: string) { return this.prisma.resume.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
  async findById(id: string) { const r = await this.prisma.resume.findUnique({ where: { id } }); if (!r) throw new NotFoundException(); return r; }
  async delete(id: string) { return this.prisma.resume.delete({ where: { id } }); }
  async analyze(id: string) {
    const resume = await this.findById(id);
    const result = await this.aiService.optimizeResume({ resumeId: id, resumeData: resume.parsedData });
    return result;
  }
  async optimize(id: string, dto: any) { return this.aiService.optimizeResume({ resumeId: id, ...dto }); }
}
