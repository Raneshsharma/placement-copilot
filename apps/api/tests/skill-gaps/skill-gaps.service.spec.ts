import { Test, TestingModule } from '@nestjs/testing';
import { SkillGapsService } from '../../../src/skill-gaps/skill-gaps.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AiService } from '../../../src/ai/ai.service';

const mockPrisma = {
  profile: { findUnique: jest.fn() },
  skillGapAnalysis: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

const mockAiService = {
  analyzeSkillGap: jest.fn(),
};

describe('SkillGapsService', () => {
  let service: SkillGapsService;
  const mockAnalysis = {
    id: 'analysis-1',
    userId: 'user-1',
    targetRole: 'Software Engineer',
    currentSkills: ['JavaScript', 'TypeScript'],
    gaps: [{ skill: 'System Design', gap: 30, priority: 'High', current: 40, target: 70 }],
    roadmap: [{ skill: 'System Design', weeks: 4, activities: ['Learn basics'] }],
    recommendations: ['Take a system design course'],
    priorityScore: 75,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillGapsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    service = module.get<SkillGapsService>(SkillGapsService);
  });

  describe('analyze()', () => {
    it('analyzes skill gaps and stores result', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue({ skills: ['JS'] });
      mockPrisma.skillGapAnalysis.create.mockResolvedValue(mockAnalysis);
      mockAiService.analyzeSkillGap.mockResolvedValue({
        data: {
          gaps: mockAnalysis.gaps,
          roadmap: mockAnalysis.roadmap,
          recommendations: mockAnalysis.recommendations,
          priorityScore: 75,
        },
      });

      const result = await service.analyze('user-1', { targetRole: 'Software Engineer' });

      expect(mockPrisma.skillGapAnalysis.create).toHaveBeenCalled();
      expect(result).toHaveProperty('gaps');
      expect(result).toHaveProperty('recommendations');
    });

    it('uses fallback data when AI fails', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.skillGapAnalysis.create.mockResolvedValue(mockAnalysis);
      mockAiService.analyzeSkillGap.mockRejectedValue(new Error('AI error'));
      const result = await service.analyze('user-1', { targetRole: 'SWE' });
      expect(result.gaps).toBeDefined();
    });
  });

  describe('getCurrent()', () => {
    it('returns latest analysis for user', async () => {
      mockPrisma.skillGapAnalysis.findFirst.mockResolvedValue(mockAnalysis);
      const result = await service.getCurrent('user-1');
      expect(result.id).toBe('analysis-1');
    });

    it('returns profile info when no analysis exists', async () => {
      mockPrisma.skillGapAnalysis.findFirst.mockResolvedValue(null);
      mockPrisma.profile.findUnique.mockResolvedValue({ completeness: 60 });
      const result = await service.getCurrent('user-1');
      expect(result.analysis).toBeNull();
      expect(result.profileCompleteness).toBe(60);
      expect(result).toHaveProperty('message');
    });
  });

  describe('getRecommendations()', () => {
    it('returns latest recommendations', async () => {
      mockPrisma.skillGapAnalysis.findFirst.mockResolvedValue(mockAnalysis);
      const result = await service.getRecommendations('user-1');
      expect(result.recommendations).toEqual(mockAnalysis.recommendations);
      expect(result.gaps).toEqual(mockAnalysis.gaps);
      expect(result.priorityScore).toBe(75);
    });

    it('returns empty arrays when no analysis', async () => {
      mockPrisma.skillGapAnalysis.findFirst.mockResolvedValue(null);
      const result = await service.getRecommendations('user-1');
      expect(result.recommendations).toEqual([]);
      expect(result.gaps).toEqual([]);
    });
  });

  describe('getHistory()', () => {
    it('returns recent analyses', async () => {
      mockPrisma.skillGapAnalysis.findMany.mockResolvedValue([mockAnalysis]);
      const result = await service.getHistory('user-1');
      expect(result).toHaveLength(1);
      expect(mockPrisma.skillGapAnalysis.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    });

    it('filters by targetRole when provided', async () => {
      mockPrisma.skillGapAnalysis.findMany.mockResolvedValue([mockAnalysis]);
      await service.getHistory('user-1', 'Software Engineer');
      expect(mockPrisma.skillGapAnalysis.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ targetRole: 'Software Engineer' }) })
      );
    });
  });
});
