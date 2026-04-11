import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProfilesService } from '../../../src/profiles/profiles.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AiService } from '../../../src/ai/ai.service';

const mockPrisma = {
  profile: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockAiService = {
  analyzeProfile: jest.fn(),
};

describe('ProfilesService', () => {
  let service: ProfilesService;
  const mockProfile = {
    id: 'profile-1',
    userId: 'user-1',
    headline: 'Software Engineer',
    summary: 'Experienced developer',
    skills: ['JavaScript', 'TypeScript'],
    experience: [{ title: 'Dev', company: 'Acme', years: 3 }],
    education: [{ degree: 'BS CS', school: 'MIT' }],
    certifications: [],
    location: 'NYC',
    phone: null,
    linkedinUrl: null,
    githubUrl: null,
    completeness: 50,
    ppsScore: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    service = module.get<ProfilesService>(ProfilesService);
  });

  describe('findByUserId()', () => {
    it('returns profile when found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      const result = await service.findByUserId('user-1');
      expect(result.id).toBe('profile-1');
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      await expect(service.findByUserId('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById()', () => {
    it('returns profile by id', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      const result = await service.findById('profile-1');
      expect(result.id).toBe('profile-1');
    });
  });

  describe('findOrCreate()', () => {
    it('returns existing profile', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      const result = await service.findOrCreate('user-1');
      expect(result.id).toBe('profile-1');
      expect(mockPrisma.profile.create).not.toHaveBeenCalled();
    });

    it('creates profile if not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.profile.create.mockResolvedValue(mockProfile);
      const result = await service.findOrCreate('user-1');
      expect(mockPrisma.profile.create).toHaveBeenCalled();
      expect(result.id).toBe('profile-1');
    });
  });

  describe('create()', () => {
    it('creates a new profile with completeness score', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.profile.create.mockResolvedValue(mockProfile);
      const dto = { headline: 'SWE', summary: 'Dev', skills: ['JS'], experience: [], education: [], certifications: [], location: 'NYC' };
      const result = await service.create('user-1', dto);
      expect(mockPrisma.profile.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });

    it('throws BadRequestException if profile already exists', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      await expect(service.create('user-1', { headline: 'SWE' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('update()', () => {
    it('updates profile and recalculates completeness', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      const updated = { ...mockProfile, headline: 'Senior Engineer', completeness: 60 };
      mockPrisma.profile.update.mockResolvedValue(updated);
      const result = await service.update('profile-1', { headline: 'Senior Engineer' });
      expect(mockPrisma.profile.update).toHaveBeenCalled();
      expect(result.headline).toBe('Senior Engineer');
    });

    it('throws NotFoundException if profile not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      await expect(service.update('nonexistent', { headline: 'SWE' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsert()', () => {
    it('updates existing profile', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      mockPrisma.profile.update.mockResolvedValue(mockProfile);
      const result = await service.upsert('user-1', { headline: 'Updated' });
      expect(mockPrisma.profile.update).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });

    it('creates profile if not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.profile.create.mockResolvedValue(mockProfile);
      const result = await service.upsert('user-1', { headline: 'New' });
      expect(mockPrisma.profile.create).toHaveBeenCalled();
    });
  });

  describe('calculateCompleteness()', () => {
    it('calculates 100% for fully filled profile', () => {
      const fullProfile = {
        headline: 'SWE',
        summary: 'Summary',
        skills: ['JS'],
        experience: [{ title: 'Dev' }],
        education: [{ degree: 'BS' }],
        certifications: ['AWS'],
        location: 'NYC',
        phone: '123',
        linkedinUrl: 'https://linkedin.com',
        githubUrl: 'https://github.com',
      };
      const result = service.calculateCompleteness(fullProfile);
      expect(result).toBe(100);
    });

    it('calculates 0% for empty profile', () => {
      const result = service.calculateCompleteness({});
      expect(result).toBe(0);
    });

    it('calculates partial completeness', () => {
      const partial = { headline: 'SWE', summary: 'Summary' };
      const result = service.calculateCompleteness(partial);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(100);
    });
  });

  describe('getAnalysis()', () => {
    it('returns AI profile analysis', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      mockAiService.analyzeProfile.mockResolvedValue({ data: { score: 85 } });
      const result = await service.getAnalysis('profile-1');
      expect(mockAiService.analyzeProfile).toHaveBeenCalled();
    });

    it('throws NotFoundException if profile not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);
      await expect(service.getAnalysis('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
