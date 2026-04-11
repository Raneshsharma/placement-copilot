import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ResumesService } from '../../../src/resumes/resumes.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AiService } from '../../../src/ai/ai.service';

const mockPrisma = {
  resume: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
    updateMany: jest.fn(),
  },
};

const mockAiService = {
  optimizeResume: jest.fn(),
};

describe('ResumesService', () => {
  let service: ResumesService;
  const mockResume = {
    id: 'resume-1',
    userId: 'user-1',
    title: 'My Resume',
    fileKey: 'abc123.pdf',
    fileUrl: '/uploads/resumes/abc123.pdf',
    isPrimary: true,
    version: 1,
    parsedData: null,
    atsScore: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    service = module.get<ResumesService>(ResumesService);
  });

  describe('list()', () => {
    it('returns resumes sorted by isPrimary desc', async () => {
      mockPrisma.resume.findMany.mockResolvedValue([mockResume]);
      const result = await service.list('user-1');
      expect(result).toHaveLength(1);
      expect(mockPrisma.resume.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('returns empty array when no resumes', async () => {
      mockPrisma.resume.findMany.mockResolvedValue([]);
      const result = await service.list('user-with-no-resumes');
      expect(result).toEqual([]);
    });
  });

  describe('findById()', () => {
    it('returns resume when found', async () => {
      mockPrisma.resume.findUnique.mockResolvedValue(mockResume);
      const result = await service.findById('resume-1');
      expect(result.id).toBe('resume-1');
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.resume.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setPrimary()', () => {
    it('sets a resume as primary and unsets others', async () => {
      mockPrisma.resume.findUnique.mockResolvedValue(mockResume);
      mockPrisma.resume.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.resume.update.mockResolvedValue({ ...mockResume, isPrimary: true });
      const result = await service.setPrimary('resume-1', 'user-1');
      expect(mockPrisma.resume.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { isPrimary: false },
      });
      expect(result.isPrimary).toBe(true);
    });

    it('throws BadRequestException for unauthorized user', async () => {
      mockPrisma.resume.findUnique.mockResolvedValue({ ...mockResume, userId: 'user-1' });
      await expect(service.setPrimary('resume-1', 'different-user')).rejects.toThrow(BadRequestException);
    });
  });

  describe('analyze()', () => {
    it('calls AI service to analyze resume', async () => {
      mockPrisma.resume.findUnique.mockResolvedValue(mockResume);
      mockAiService.optimizeResume.mockResolvedValue({ data: { atsScore: 85 } });
      const result = await service.analyze('resume-1');
      expect(mockAiService.optimizeResume).toHaveBeenCalled();
    });
  });

  describe('optimize()', () => {
    it('calls AI service with target role and companies', async () => {
      mockPrisma.resume.findUnique.mockResolvedValue(mockResume);
      mockAiService.optimizeResume.mockResolvedValue({ data: { suggestions: ['Add keywords'] } });
      await service.optimize('resume-1', { targetRole: 'Senior SWE', targetCompanies: ['Google', 'Meta'] });
      expect(mockAiService.optimizeResume).toHaveBeenCalledWith(
        expect.objectContaining({ targetRole: 'Senior SWE', targetCompanies: ['Google', 'Meta'] })
      );
    });
  });
});
