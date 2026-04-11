import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InterviewsService } from '../../../src/interviews/interviews.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { AiService } from '../../../src/ai/ai.service';
import { InterviewType, InterviewStatus } from '@prisma/client';

const mockPrisma = {
  mockInterview: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

const mockAiService = {
  startInterview: jest.fn(),
};

describe('InterviewsService', () => {
  let service: InterviewsService;
  const mockInterview = {
    id: 'int-1',
    userId: 'user-1',
    type: InterviewType.TECHNICAL,
    status: InterviewStatus.IN_PROGRESS,
    questions: [{ id: 'q1', text: 'Tell me about yourself', type: 'behavioral', duration: 120 }],
    answers: [],
    transcript: [],
    feedback: null,
    scores: null,
    data: { role: 'SWE', company: 'Acme' },
    createdAt: new Date(),
    startedAt: new Date(),
    completedAt: null,
    duration: null,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();
    service = module.get<InterviewsService>(InterviewsService);
  });

  describe('list()', () => {
    it('returns paginated interviews', async () => {
      mockPrisma.mockInterview.findMany.mockResolvedValue([mockInterview]);
      mockPrisma.mockInterview.count.mockResolvedValue(1);
      const result = await service.list('user-1');
      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('returns empty array when no interviews', async () => {
      mockPrisma.mockInterview.findMany.mockResolvedValue([]);
      mockPrisma.mockInterview.count.mockResolvedValue(0);
      const result = await service.list('user-with-no-interviews');
      expect(result.items).toEqual([]);
    });
  });

  describe('start()', () => {
    it('creates interview and generates questions via AI', async () => {
      const created = { id: 'int-1', userId: 'user-1', status: InterviewStatus.SETUP };
      const updated = { ...mockInterview };
      mockPrisma.mockInterview.create.mockResolvedValue(created);
      mockPrisma.mockInterview.update.mockResolvedValue(updated);
      mockAiService.startInterview.mockResolvedValue({
        data: {
          questions: [{ id: 'q1', text: 'New question', type: 'technical', duration: 300 }],
          tips: ['Be specific'],
          estimatedDuration: 30,
        },
      });

      const result = await service.start('user-1', {
        type: InterviewType.TECHNICAL,
        role: 'SWE',
        company: 'Acme',
      });

      expect(mockPrisma.mockInterview.create).toHaveBeenCalled();
      expect(mockPrisma.mockInterview.update).toHaveBeenCalled();
      expect(result).toHaveProperty('questions');
    });

    it('uses fallback questions when AI fails', async () => {
      const created = { id: 'int-1', userId: 'user-1', status: InterviewStatus.SETUP };
      mockPrisma.mockInterview.create.mockResolvedValue(created);
      mockPrisma.mockInterview.update.mockResolvedValue({ ...mockInterview });
      mockAiService.startInterview.mockRejectedValue(new Error('AI unavailable'));

      const result = await service.start('user-1', {
        type: InterviewType.TECHNICAL,
        role: 'SWE',
        company: 'Acme',
      });

      expect(result.questions).toBeDefined();
      expect(result.questions.length).toBeGreaterThan(0);
    });
  });

  describe('findById()', () => {
    it('returns interview when found', async () => {
      mockPrisma.mockInterview.findUnique.mockResolvedValue(mockInterview);
      const result = await service.findById('int-1');
      expect(result.id).toBe('int-1');
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.mockInterview.findUnique.mockResolvedValue(null);
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('answer()', () => {
    it('appends answer to transcript', async () => {
      mockPrisma.mockInterview.findUnique.mockResolvedValue(mockInterview);
      mockPrisma.mockInterview.update.mockResolvedValue(mockInterview);
      await service.answer('int-1', { answer: 'I have 5 years of experience' });
      expect(mockPrisma.mockInterview.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            answers: expect.any(Array),
            transcript: expect.any(Array),
          }),
        })
      );
    });
  });

  describe('submitAnswer()', () => {
    it('submits answer with questionId', async () => {
      mockPrisma.mockInterview.findUnique.mockResolvedValue(mockInterview);
      mockPrisma.mockInterview.update.mockResolvedValue(mockInterview);
      await service.submitAnswer('int-1', { questionId: 'q1', answer: 'My answer' });
      expect(mockPrisma.mockInterview.update).toHaveBeenCalled();
    });
  });

  describe('getFeedback()', () => {
    it('returns feedback for completed interview', async () => {
      const completed = { ...mockInterview, status: InterviewStatus.COMPLETED, feedback: 'Great job!', scores: { overall: 85 } };
      mockPrisma.mockInterview.findUnique.mockResolvedValue(completed);
      const result = await service.getFeedback('int-1');
      expect(result).toHaveProperty('feedback');
      expect(result).toHaveProperty('scores');
    });

    it('throws NotFoundException when interview not completed', async () => {
      mockPrisma.mockInterview.findUnique.mockResolvedValue(mockInterview);
      await expect(service.getFeedback('int-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('complete()', () => {
    it('marks interview as completed and generates feedback via AI', async () => {
      mockPrisma.mockInterview.findUnique.mockResolvedValue(mockInterview);
      mockPrisma.mockInterview.update.mockResolvedValue({ ...mockInterview, status: InterviewStatus.COMPLETED });
      mockAiService.startInterview.mockResolvedValue({
        data: { feedback: 'Well done', scores: { overall: 90 } },
      });

      await service.complete('int-1');

      expect(mockPrisma.mockInterview.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: InterviewStatus.COMPLETED }),
        })
      );
    });
  });

  describe('evaluateAnswer()', () => {
    it('returns AI evaluation for an answer', async () => {
      mockAiService.startInterview.mockResolvedValue({
        data: { score: 80, feedback: 'Good answer', tips: ['Add more detail'] },
      });

      const result = await service.evaluateAnswer('int-1', 'q1', 'My detailed answer');

      expect(mockAiService.startInterview).toHaveBeenCalledWith(
        expect.objectContaining({ evaluation: true, questionId: 'q1', answer: 'My detailed answer' })
      );
    });

    it('returns fallback evaluation when AI fails', async () => {
      mockAiService.startInterview.mockRejectedValue(new Error('AI error'));
      const result = await service.evaluateAnswer('int-1', 'q1', 'My answer');
      expect(result.data.score).toBe(75);
    });
  });
});
