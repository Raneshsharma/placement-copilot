import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async analyzeProfile(data: any) { return this.post('/api/v1/profile/analyze', data); }
  async calculateScore(data: any) { return this.post('/api/v1/scoring/calculate', data); }
  async optimizeResume(data: any) { return this.post('/api/v1/resume/optimize', data); }
  async startInterview(data: any) { return this.post('/api/v1/interview/start', data); }
  async analyzeSkillGap(data: any) { return this.post('/api/v1/skill-gap/analyze', data); }
  async generateGuidance(data: any) { return this.post('/api/v1/application/guidance', data); }
  async getDashboardData(data: any) { return this.post('/api/v1/tracking/dashboard', data); }

  private async post(path: string, data: any) {
    // In production: use axios. For MVP: return mock response.
    // await axios.post(`${this.baseUrl}${path}`, data, { timeout: 30000 });
    return { status: 'ok', path, data, message: 'AI service call (mock for MVP)' };
  }
}
