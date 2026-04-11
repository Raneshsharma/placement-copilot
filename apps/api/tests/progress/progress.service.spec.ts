import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from '../../../src/progress/progress.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AiService } from '../../../src/ai/ai.service';
import { ApplicationStatus } from '@prisma/client';

const mockPrisma = {
  application: { findMany: jest.fn() },
  mockInterview: { findMany: jest.fn() },
  profile: { findUnique: jest.fn() },
  resume: { findMany: jest.fn() },
};

const mockAiService = {};

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    service = module.get<ProgressService>(ProgressService);
  });

  describe('getDashboard()', () => {
    it('computes dashboard metrics from application and interview data', async () => {
      mockPrisma.application.findMany.mockResolvedValue([
        { id: 'app-1', userId: 'user-1', status: ApplicationStatus.SUBMITTED, createdAt: new Date() },
        { id: 'app-2', userId: 'user-1', status: ApplicationStatus.OFFERED, createdAt: new Date() },
        { id: 'app-3', userId: 'user-1', status: ApplicationStatus.DRAFT, createdAt: new Date() },
      ]);
      mockPrisma.mockInterview.findMany.mockResolvedValue([
        { id: 'int-1', userId: 'user-1', status: 'COMPLETED', startedAt: new Date(), scores: { overall: 80 } },
      ]);
      mockPrisma.profile.findUnique.mockResolvedValue({ completeness: 75, ppsScore: 72 });
      mockPrisma.resume.findMany.mockResolvedValue([{ id: 'r1' }]);
      mockPrisma.application.findMany.mockResolvedValue([
        { id: 'app-1', userId: 'user-1', status: ApplicationStatus.SUBMITTED, createdAt: new Date(), jobListing: {} },
      ]);

      // Override findMany calls with specific resolutions per call index
      let callCount = 0;
      mockPrisma.application.findMany.mockImplementation(() => {
        if (callCount++ === 0) {
          return Promise.resolve([
            { id: 'app-1', userId: 'user-1', status: ApplicationStatus.SUBMITTED, createdAt: new Date() },
            { id: 'app-2', userId: 'user-1', status: ApplicationStatus.OFFERED, createdAt: new Date() },
            { id: 'app-3', userId: 'user-1', status: ApplicationStatus.DRAFT, createdAt: new Date() },
          ]);
        }
        return Promise.resolve([
          { id: 'app-1', userId: 'user-1', status: ApplicationStatus.SUBMITTED, createdAt: new Date(), jobListing: {} },
        ]);
      });

      const result = await service.getDashboard('user-1');

      expect(result.totalApplications).toBe(3);
      expect(result.submittedApplications).toBe(2);
      expect(result.offerCount).toBe(1);
      expect(result.interviewCount).toBe(1);
      expect(result).toHaveProperty('applicationStatuses');
      expect(result).toHaveProperty('milestones');
    });

    it('returns zeros when no data exists', async () => {
      mockPrisma.application.findMany.mockResolvedValue([]);
      mockPrisma.mockInterview.findMany.mockResolvedValue([]);
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.resume.findMany.mockResolvedValue([]);
      mockPrisma.application.findMany.mockResolvedValue([]);
      // Second call for recentApplications
      mockPrisma.application.findMany.mockResolvedValueOnce([]).mockResolvedValue([]);

      const result = await service.getDashboard('user-with-no-data');

      expect(result.totalApplications).toBe(0);
      expect(result.submittedApplications).toBe(0);
      expect(result.interviewCount).toBe(0);
    });
  });

  describe('getAnalytics()', () => {
    it('computes analytics metrics', async () => {
      mockPrisma.application.findMany.mockResolvedValue([
        { id: 'app-1', status: ApplicationStatus.SUBMITTED, createdAt: new Date() },
        { id: 'app-2', status: ApplicationStatus.OFFERED, createdAt: new Date() },
        { id: 'app-3', status: ApplicationStatus.SUBMITTED, createdAt: new Date() },
      ]);
      mockPrisma.mockInterview.findMany.mockResolvedValue([
        { id: 'int-1', status: 'COMPLETED', startedAt: new Date(), scores: { overall: 85 } },
        { id: 'int-2', status: 'FEEDBACK_READY', startedAt: new Date(), scores: { overall: 70 } },
      ]);

      const result = await service.getAnalytics('user-1');

      expect(result.totalApplications).toBe(3);
      expect(result.completedInterviews).toBe(2);
      expect(result).toHaveProperty('byStatus');
      expect(result).toHaveProperty('weeklyActivity');
    });
  });

  describe('getTimeline()', () => {
    it('returns applications ordered by createdAt asc', async () => {
      const applications = [
        { id: 'app-1', company: 'Acme', position: 'SWE', status: ApplicationStatus.SUBMITTED, createdAt: new Date('2024-01-01'), appliedAt: new Date('2024-01-02') },
        { id: 'app-2', company: 'Beta', position: 'PM', status: ApplicationStatus.SUBMITTED, createdAt: new Date('2024-02-01'), appliedAt: new Date('2024-02-02') },
      ];
      mockPrisma.application.findMany.mockResolvedValue(applications);
      const result = await service.getTimeline('user-1');
      expect(result).toHaveLength(2);
      expect(result[0].company).toBe('Acme');
      expect(result[1].company).toBe('Beta');
    });

    it('returns empty array when no applications', async () => {
      mockPrisma.application.findMany.mockResolvedValue([]);
      const result = await service.getTimeline('user-with-no-apps');
      expect(result).toEqual([]);
    });
  });
});
