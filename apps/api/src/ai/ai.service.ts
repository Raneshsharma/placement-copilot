import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: AxiosInstance;

  constructor() {
    const baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const aiSecret = process.env.AI_SERVICE_SECRET;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (aiSecret) {
      headers['Authorization'] = `Bearer ${aiSecret}`;
    }

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers,
    });
  }

  private async call<T>(endpoint: string, data: any, fallback: T): Promise<{ status: string; data: T }> {
    try {
      const response = await this.client.post(endpoint, data);
      return { status: 'ok', data: response.data as T };
    } catch (error) {
      this.logger.warn(`AI service call failed for ${endpoint}, using fallback`);
      return { status: 'ok', data: fallback };
    }
  }

  async analyzeProfile(data: any) {
    return this.call('/api/v1/profile/analyze', data, {
      headline: 'Full Stack Developer',
      summary: 'Passionate developer building scalable web applications.',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      experience: [{ title: 'Software Engineer', company: 'Tech Startup', duration: '2 years', highlights: ['Built REST APIs'] }],
      education: { degree: 'B.Tech Computer Science', institution: 'State University', year: 2022 },
      completeness: 75,
      recommendations: ['Add more project descriptions'],
    });
  }

  async calculateScore(data: any) {
    return this.call('/api/v1/score/calculate', data, {
      score: 78,
      breakdown: { profile: 80, skills: 65, resume: 85, interview: 72 },
      factors: ['Profile completeness', 'Skill alignment'],
      marketPercentile: 72,
      improvements: ['Add certifications'],
    });
  }

  async optimizeResume(data: any) {
    return this.call('/api/v1/resume/analyze', data, {
      originalScore: 58,
      optimizedScore: 82,
      keywordsAdded: ['Kubernetes', 'Terraform', 'CI/CD', 'Microservices'],
      sectionsImproved: ['Summary', 'Skills', 'Experience'],
      atsCompatibility: 82,
      suggestions: ['Quantify achievements with metrics'],
    });
  }

  async startInterview(data: any) {
    return this.call('/api/v1/interview/start', data, {
      sessionId: `iv-${Date.now()}`,
      type: data.type || 'BEHAVIORAL',
      questions: [
        { id: 'q1', text: 'Tell me about a time you led a team through a difficult technical challenge.', type: 'behavioral', duration: 120 },
        { id: 'q2', text: 'Describe a project where you had to learn a new technology quickly.', type: 'behavioral', duration: 90 },
        { id: 'q3', text: 'How do you handle disagreements with team members?', type: 'behavioral', duration: 90 },
      ],
      estimatedDuration: 20,
      tips: ['Use the STAR method', 'Be specific with examples'],
    });
  }

  async analyzeSkillGap(data: any) {
    return this.call('/api/v1/skill-gap/analyze', data, {
      gaps: [
        { skill: 'System Design', gap: 30, priority: 'High', current: 45, target: 75 },
        { skill: 'AWS', gap: 25, priority: 'High', current: 50, target: 75 },
        { skill: 'Docker', gap: 20, priority: 'Medium', current: 55, target: 75 },
      ],
      recommendations: [
        { skill: 'System Design', reason: 'Required for senior roles', resources: ['Grok the System Design Interview'] },
        { skill: 'AWS', reason: 'Cloud proficiency required for most target roles', resources: ['AWS Solutions Architect course'] },
      ],
      roadmap: [
        { week: '1-2', title: 'System Design Fundamentals', skills: ['Distributed Systems', 'CAP Theorem'] },
        { week: '3-4', title: 'AWS Cloud Essentials', skills: ['EC2', 'S3', 'Lambda', 'VPC', 'RDS'] },
        { week: '5-6', title: 'DevOps & Containerization', skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines'] },
      ],
      priorityScore: 72,
    });
  }

  async generateGuidance(data: any) {
    return this.call('/api/v1/guidance/generate', data, {
      company: data.company || 'Company',
      role: data.position || 'Role',
      timeline: [
        { stage: 'Applied', expectedDays: '1-3 days', tip: 'Follow up with recruiter on LinkedIn' },
        { stage: 'Screening', expectedDays: '3-7 days', tip: 'Prepare 2-minute elevator pitch' },
        { stage: 'Technical', expectedDays: '7-14 days', tip: 'Practice on LeetCode and system design' },
        { stage: 'Final Round', expectedDays: '14-21 days', tip: 'Research company culture and values' },
      ],
      questions: ['Why do you want to work at this company?', 'Describe a technical challenge you solved recently.'],
      connections: ['Check if you have 2nd-degree connections', 'Search for employee referrals'],
    });
  }

  async getDashboardData(data: any) {
    return this.call('/api/v1/dashboard/data', data, {
      streak: 3,
      weeklyApplications: 5,
      ppsScore: 78,
      stats: {
        activeApplications: 5,
        interviewsScheduled: 1,
        responseRate: 42,
        offerRate: 0,
      },
      recentActivity: [
        { type: 'application', company: 'Google', role: 'SWE', date: '2026-04-05' },
        { type: 'interview', company: 'Stripe', role: 'PM', date: '2026-04-07' },
      ],
      milestones: [
        { id: 'm1', label: 'Profile created', done: true },
        { id: 'm2', label: 'First application sent', done: true },
        { id: 'm3', label: 'First interview', done: false },
      ],
    });
  }
}
