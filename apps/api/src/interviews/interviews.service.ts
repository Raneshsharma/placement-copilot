import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { InterviewType, InterviewStatus } from '@prisma/client';

@Injectable()
export class InterviewsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async list(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.mockInterview.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.mockInterview.count({ where: { userId } }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async start(userId: string, dto: { type: InterviewType; role: string; company: string; difficulty?: string; applicationId?: string }) {
    // Create interview record
    const interview = await this.prisma.mockInterview.create({
      data: {
        userId,
        applicationId: dto.applicationId || null,
        type: dto.type || InterviewType.TECHNICAL,
        status: InterviewStatus.SETUP,
      },
    });

    // Generate questions via AI
    try {
      const aiResult = await this.aiService.startInterview({
        sessionId: interview.id,
        type: dto.type,
        role: dto.role,
        company: dto.company,
        difficulty: dto.difficulty || 'medium',
      });

      const questions = aiResult.data?.questions || [];
      const tips = aiResult.data?.tips || [];

      await this.prisma.mockInterview.update({
        where: { id: interview.id },
        data: {
          status: InterviewStatus.IN_PROGRESS,
          questions,
          startedAt: new Date(),
          data: { role: dto.role, company: dto.company, difficulty: dto.difficulty, tips },
        },
      });

      return {
        ...interview,
        questions,
        tips,
        estimatedDuration: aiResult.data?.estimatedDuration || 20,
      };
    } catch {
      // Fallback questions if AI is unavailable
      const fallbackQuestions = [
        { id: 'q1', text: 'Tell me about yourself.', type: 'behavioral', duration: 120 },
        { id: 'q2', text: `Describe a project you are most proud of.`, type: 'behavioral', duration: 180 },
        { id: 'q3', text: 'What are your greatest strengths and weaknesses?', type: 'behavioral', duration: 120 },
      ];
      await this.prisma.mockInterview.update({
        where: { id: interview.id },
        data: {
          status: InterviewStatus.IN_PROGRESS,
          questions: fallbackQuestions,
          startedAt: new Date(),
          data: { role: dto.role, company: dto.company, fallback: true },
        },
      });
      return { ...interview, questions: fallbackQuestions, tips: [], estimatedDuration: 20 };
    }
  }

  async findById(id: string) {
    const interview = await this.prisma.mockInterview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');
    return interview;
  }

  async answer(id: string, dto: { answer: string; duration?: number }) {
    const interview = await this.findById(id);
    const answers = [...((interview.answers as any[]) || []), dto.answer];
    return this.prisma.mockInterview.update({
      where: { id },
      data: {
        answers,
        transcript: [
          ...((interview.transcript as any[]) || []),
          { type: 'answer', text: dto.answer, timestamp: new Date().toISOString(), duration: dto.duration },
        ],
        status: InterviewStatus.IN_PROGRESS,
      },
    });
  }

  async submitAnswer(id: string, dto: { questionId: string; answer: string; duration?: number }) {
    const interview = await this.findById(id);
    const answers = [...((interview.answers as any[]) || []), { questionId: dto.questionId, text: dto.answer }];
    const transcript = [
      ...((interview.transcript as any[]) || []),
      { type: 'answer', questionId: dto.questionId, text: dto.answer, timestamp: new Date().toISOString(), duration: dto.duration },
    ];
    return this.prisma.mockInterview.update({
      where: { id },
      data: { answers, transcript },
    });
  }

  async getFeedback(id: string) {
    const interview = await this.findById(id);
    if (interview.status !== InterviewStatus.COMPLETED && interview.status !== InterviewStatus.FEEDBACK_READY) {
      throw new NotFoundException('Interview not completed yet');
    }
    return {
      feedback: interview.feedback,
      scores: interview.scores,
      transcript: interview.transcript,
    };
  }

  async complete(id: string) {
    const interview = await this.findById(id);
    const answers = (interview.answers as any[]) || [];
    const transcript = (interview.transcript as any[]) || [];

    // Generate feedback via AI
    try {
      const feedback = await this.aiService.startInterview({
        sessionId: id,
        type: interview.type,
        answers,
        transcript,
      });
      const feedbackData = feedback.data as any;
      await this.prisma.mockInterview.update({
        where: { id },
        data: {
          status: InterviewStatus.COMPLETED,
          completedAt: new Date(),
          feedback: feedbackData?.feedback || 'Interview completed',
          scores: feedbackData?.scores || {},
          duration: interview.startedAt
            ? Math.round((Date.now() - new Date(interview.startedAt).getTime()) / 60000)
            : null,
        },
      });
    } catch {
      await this.prisma.mockInterview.update({
        where: { id },
        data: {
          status: InterviewStatus.COMPLETED,
          completedAt: new Date(),
          duration: interview.startedAt
            ? Math.round((Date.now() - new Date(interview.startedAt).getTime()) / 60000)
            : null,
        },
      });
    }

    return this.findById(id);
  }

  async evaluateAnswer(id: string, questionId: string, answer: string) {
    try {
      return await this.aiService.startInterview({
        sessionId: id,
        questionId,
        answer,
        evaluation: true,
      });
    } catch {
      return {
        data: {
          score: 75,
          feedback: 'Good answer, but could benefit from more specific examples.',
          tips: ['Consider adding metrics or quantifiable results'],
        },
      };
    }
  }
}
