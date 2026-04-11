import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from '../../../src/jobs/jobs.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

const mockPrisma = {
  jobListing: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  profile: {
    findUnique: jest.fn(),
  },
};

describe('JobsService', () => {
  let service: JobsService;
  const mockJob = {
    id: 'job-1',
    title: 'Software Engineer',
    company: 'Acme',
    location: 'New York',
    status: 'ACTIVE',
    description: 'Great opportunity',
    keywords: ['javascript', 'typescript'],
    requirements: ['5 years'],
    salaryMin: 80000,
    salaryMax: 120000,
    locationType: 'REMOTE',
    source: 'LINKEDIN',
    postedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<JobsService>(JobsService);
  });

  describe('list()', () => {
    it('returns paginated jobs', async () => {
      mockPrisma.jobListing.findMany.mockResolvedValue([mockJob]);
      mockPrisma.jobListing.count.mockResolvedValue(1);
      const result = await service.list({});
      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('filters by location', async () => {
      mockPrisma.jobListing.findMany.mockResolvedValue([mockJob]);
      mockPrisma.jobListing.count.mockResolvedValue(1);
      await service.list({ location: 'New York' });
      expect(mockPrisma.jobListing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ location: { contains: 'New York', mode: 'insensitive' } }),
        })
      );
    });

    it('respects page and limit params', async () => {
      mockPrisma.jobListing.findMany.mockResolvedValue([mockJob]);
      mockPrisma.jobListing.count.mockResolvedValue(50);
      const result = await service.list({ page: 2, limit: 10 });
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(5);
    });
  });

  describe('search()', () => {
    it('searches by query term across title, company, description', async () => {
      mockPrisma.jobListing.findMany.mockResolvedValue([mockJob]);
      await service.search({ query: 'Software' });
      expect(mockPrisma.jobListing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'ACTIVE',
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('uses default limit of 20', async () => {
      mockPrisma.jobListing.findMany.mockResolvedValue([]);
      await service.search({});
      expect(mockPrisma.jobListing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 20 })
      );
    });
  });

  describe('findById()', () => {
    it('returns job when found', async () => {
      mockPrisma.jobListing.findUnique.mockResolvedValue(mockJob);
      const result = await service.findById('job-1');
      expect(result.id).toBe('job-1');
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.jobListing.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recommended()', () => {
    it('returns jobs matching profile skills', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue({
        skills: ['JavaScript', 'TypeScript'],
        experience: [{ title: 'Software Engineer' }],
      });
      mockPrisma.jobListing.findMany.mockResolvedValue([mockJob]);
      const result = await service.recommended('user-1');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns recent jobs when no profile', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.jobListing.findMany.mockResolvedValue([mockJob]);
      const result = await service.recommended('user-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('save()', () => {
    it('creates a new job listing', async () => {
      mockPrisma.jobListing.create.mockResolvedValue(mockJob);
      const result = await service.save('user-1', { title: 'Software Engineer', company: 'Acme' });
      expect(mockPrisma.jobListing.create).toHaveBeenCalled();
      expect(result.title).toBe('Software Engineer');
    });
  });

  describe('update()', () => {
    it('updates a job listing', async () => {
      const updated = { ...mockJob, title: 'Senior Engineer' };
      mockPrisma.jobListing.update.mockResolvedValue(updated);
      const result = await service.update('job-1', { title: 'Senior Engineer' });
      expect(mockPrisma.jobListing.update).toHaveBeenCalled();
      expect(result.title).toBe('Senior Engineer');
    });
  });

  describe('unsave()', () => {
    it('deletes a job listing', async () => {
      mockPrisma.jobListing.delete.mockResolvedValue(mockJob);
      await service.unsave('job-1');
      expect(mockPrisma.jobListing.delete).toHaveBeenCalledWith({ where: { id: 'job-1' } });
    });

    it('returns error message when job not found', async () => {
      mockPrisma.jobListing.delete.mockRejectedValue(new Error('not found'));
      const result = await service.unsave('nonexistent');
      expect(result).toHaveProperty('deleted', false);
    });
  });
});
