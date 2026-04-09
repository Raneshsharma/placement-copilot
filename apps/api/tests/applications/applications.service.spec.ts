import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from '../../../src/applications/applications.service';
import { PrismaService } from '../../../src/prisma/prisma.service';

const mockPrisma = {
  application: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('list()', () => {
    it('returns applications for a user sorted by createdAt desc', async () => {
      const mockApps = [
        { id: 'app-1', userId: 'user-1', company: 'Acme', role: 'Engineer', job: {} },
        { id: 'app-2', userId: 'user-1', company: 'Beta', role: 'PM', job: {} },
      ];
      mockPrisma.application.findMany.mockResolvedValue(mockApps);

      const result = await service.list('user-1');

      expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { job: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].company).toBe('Acme');
    });

    it('returns empty array when no applications exist', async () => {
      mockPrisma.application.findMany.mockResolvedValue([]);

      const result = await service.list('user-with-no-apps');

      expect(result).toEqual([]);
    });
  });

  describe('create()', () => {
    it('creates an application with default DRAFT status', async () => {
      const mockApp = { id: 'app-new', userId: 'user-1', company: 'Acme', role: 'SWE', status: 'DRAFT' };
      mockPrisma.application.create.mockResolvedValue(mockApp);

      const dto = { company: 'Acme', role: 'SWE' };
      const result = await service.create('user-1', dto);

      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          company: 'Acme',
          role: 'SWE',
          status: 'DRAFT',
          timeline: expect.any(Array),
        }),
      });
      expect(result.status).toBe('DRAFT');
    });

    it('creates an application with provided status', async () => {
      const mockApp = { id: 'app-new', userId: 'user-1', company: 'Beta', role: 'PM', status: 'SUBMITTED' };
      mockPrisma.application.create.mockResolvedValue(mockApp);

      const dto = { company: 'Beta', role: 'PM', status: 'SUBMITTED' };
      await service.create('user-1', dto);

      expect(mockPrisma.application.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'SUBMITTED' }),
        }),
      );
    });
  });

  describe('update()', () => {
    it('updates application and appends timeline entry', async () => {
      const existingApp = { id: 'app-1', userId: 'user-1', status: 'DRAFT', timeline: [] };
      const updatedApp = { ...existingApp, status: 'SUBMITTED' };
      mockPrisma.application.findUnique.mockResolvedValue(existingApp);
      mockPrisma.application.update.mockResolvedValue(updatedApp);

      const result = await service.update('app-1', { status: 'SUBMITTED' });

      expect(mockPrisma.application.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'app-1' },
          data: expect.objectContaining({
            status: 'SUBMITTED',
            timeline: expect.any(Array),
          }),
        }),
      );
    });

    it('preserves existing timeline when updating', async () => {
      const existingApp = {
        id: 'app-1',
        userId: 'user-1',
        status: 'SUBMITTED',
        timeline: [{ status: 'SUBMITTED', timestamp: '2024-01-01T00:00:00Z' }],
      };
      mockPrisma.application.findUnique.mockResolvedValue(existingApp);
      mockPrisma.application.update.mockResolvedValue(existingApp);

      await service.update('app-1', { status: 'INTERVIEW' });

      const updateCall = mockPrisma.application.update.mock.calls[0][0];
      expect(updateCall.data.timeline).toHaveLength(2); // old + new
    });
  });

  describe('getTimeline()', () => {
    it('returns timeline array for an application', async () => {
      const timeline = [
        { status: 'DRAFT', timestamp: '2024-01-01T00:00:00Z' },
        { status: 'SUBMITTED', timestamp: '2024-01-05T00:00:00Z' },
      ];
      mockPrisma.application.findUnique.mockResolvedValue({ timeline });

      const result = await service.getTimeline('app-1');

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('DRAFT');
    });

    it('returns empty array if application not found', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      const result = await service.getTimeline('non-existent');

      expect(result).toEqual([]);
    });
  });

  describe('delete()', () => {
    it('deletes an application by id', async () => {
      mockPrisma.application.delete.mockResolvedValue({ id: 'app-1' });

      await service.delete('app-1');

      expect(mockPrisma.application.delete).toHaveBeenCalledWith({ where: { id: 'app-1' } });
    });
  });
});
