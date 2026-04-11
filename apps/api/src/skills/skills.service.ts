import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

// Skill categories per role type for radar chart (F8.3)
const RADAR_AXES: Record<string, string[]> = {
  default: ['Frontend', 'Backend', 'DevOps', 'Database', 'Soft Skills', 'System Design'],
  'Software Engineer': ['Frontend', 'Backend', 'DevOps', 'Database', 'Testing', 'System Design'],
  'Product Manager': ['Strategy', 'Analytics', 'Communication', 'Agile', 'Technical', 'Leadership'],
  'Data Scientist': ['Statistics', 'Machine Learning', 'Programming', 'Data Eng.', 'Visualization', 'Domain'],
};

// Required skills per role
const ROLE_REQUIRED_SKILLS: Record<string, { skill: string; level: number; priority: string; estimatedTime: string }[]> = {
  default: [],
  'Software Engineer': [
    { skill: 'JavaScript', level: 4, priority: 'HIGH', estimatedTime: '2 weeks' },
    { skill: 'TypeScript', level: 4, priority: 'HIGH', estimatedTime: '2 weeks' },
    { skill: 'React', level: 4, priority: 'HIGH', estimatedTime: '3 weeks' },
    { skill: 'Node.js', level: 3, priority: 'HIGH', estimatedTime: '2 weeks' },
    { skill: 'SQL', level: 3, priority: 'MEDIUM', estimatedTime: '1 week' },
    { skill: 'Git', level: 4, priority: 'HIGH', estimatedTime: '3 days' },
    { skill: 'Docker', level: 3, priority: 'MEDIUM', estimatedTime: '2 weeks' },
    { skill: 'System Design', level: 3, priority: 'HIGH', estimatedTime: '3 weeks' },
    { skill: 'Testing', level: 3, priority: 'MEDIUM', estimatedTime: '1 week' },
    { skill: 'CI/CD', level: 2, priority: 'LOW', estimatedTime: '1 week' },
  ],
  'Product Manager': [
    { skill: 'Strategic Thinking', level: 4, priority: 'HIGH', estimatedTime: '2 weeks' },
    { skill: 'Data Analysis', level: 4, priority: 'HIGH', estimatedTime: '3 weeks' },
    { skill: 'Communication', level: 5, priority: 'HIGH', estimatedTime: 'ongoing' },
    { skill: 'Agile/Scrum', level: 4, priority: 'HIGH', estimatedTime: '1 week' },
    { skill: 'Technical Literacy', level: 3, priority: 'MEDIUM', estimatedTime: '2 weeks' },
    { skill: 'Leadership', level: 3, priority: 'MEDIUM', estimatedTime: 'ongoing' },
  ],
  'Data Scientist': [
    { skill: 'Python', level: 5, priority: 'HIGH', estimatedTime: '4 weeks' },
    { skill: 'Statistics', level: 4, priority: 'HIGH', estimatedTime: '3 weeks' },
    { skill: 'Machine Learning', level: 4, priority: 'HIGH', estimatedTime: '6 weeks' },
    { skill: 'SQL', level: 4, priority: 'HIGH', estimatedTime: '2 weeks' },
    { skill: 'Data Visualization', level: 4, priority: 'MEDIUM', estimatedTime: '2 weeks' },
    { skill: 'Deep Learning', level: 3, priority: 'MEDIUM', estimatedTime: '4 weeks' },
  ],
};

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async getUserSkills(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const skills = (profile?.skills as string[]) || [];
    return {
      skills,
      targetRole: profile?.headline || null,
      count: skills.length,
    };
  }

  async analyzeGap(userId: string, targetRole: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const userSkills = new Set((profile?.skills as string[]) || []);

    const required = ROLE_REQUIRED_SKILLS[targetRole] || ROLE_REQUIRED_SKILLS['Software Engineer'];
    const gaps: any[] = [];
    const matched: string[] = [];

    for (const req of required) {
      const normalizedReq = req.skill.toLowerCase();
      const isMatched = Array.from(userSkills).some(
        (s) => s.toLowerCase() === normalizedReq || s.toLowerCase().includes(normalizedReq) || normalizedReq.includes(s.toLowerCase()),
      );
      if (isMatched) {
        matched.push(req.skill);
      } else {
        gaps.push({
          skill: req.skill,
          currentLevel: 1,
          requiredLevel: req.level,
          priority: req.priority,
          estimatedTime: req.estimatedTime,
        });
      }
    }

    const readiness = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0;

    return { gaps, matched, readiness };
  }

  async getRadarChartData(userId: string, targetRole: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const userSkills = new Set((profile?.skills as string[]) || []);
    const axes = RADAR_AXES[targetRole] || RADAR_AXES['default'];

    // Assign each axis a 0-100 score based on skill matches
    const axisSkillMap: Record<string, string[]> = {
      Frontend: ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Angular', 'Svelte'],
      Backend: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', '.NET'],
      DevOps: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Terraform', 'Linux'],
      Database: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB', 'Elasticsearch'],
      'Soft Skills': ['Communication', 'Leadership', 'Teamwork', 'Problem Solving'],
      'System Design': ['System Design', 'Microservices', 'Distributed Systems', 'Scalability'],
      Testing: ['Testing', 'Jest', 'Cypress', 'Selenium', 'TDD'],
      Strategy: ['Strategic Thinking', 'Roadmapping', 'Market Analysis'],
      Analytics: ['Data Analysis', 'SQL', 'Tableau', 'Power BI', 'A/B Testing'],
      Communication: ['Communication', 'Presentation', 'Writing'],
      Agile: ['Agile', 'Scrum', 'Kanban', 'JIRA'],
      Technical: ['Technical Literacy', 'APIs', 'Architecture'],
      Leadership: ['Leadership', 'Mentoring', 'Decision Making'],
      Statistics: ['Statistics', 'Probability', 'Hypothesis Testing'],
      'Machine Learning': ['Machine Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
      Programming: ['Python', 'R', 'SQL'],
      'Data Eng.': ['ETL', 'Spark', 'Airflow', 'Kafka'],
      Visualization: ['Data Visualization', 'D3.js', 'Tableau', 'Power BI'],
      Domain: ['Domain Knowledge', 'Business Logic'],
      'Deep Learning': ['Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision'],
    };

    const current: number[] = [];
    const required: number[] = [];

    for (const axis of axes) {
      const matchedSkills = axisSkillMap[axis] || [];
      const matchedCount = matchedSkills.filter(
        (s) => Array.from(userSkills).some((us) => us.toLowerCase() === s.toLowerCase() || us.toLowerCase().includes(s.toLowerCase())),
      ).length;
      current.push(Math.min(100, Math.round((matchedCount / Math.max(matchedSkills.length, 1)) * 100)));
      required.push(100);
    }

    return { categories: axes, current, required };
  }

  async analyzeSkills(userId: string, targetRole: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const userSkills = (profile?.skills as string[]) || [];

    let aiResult: any;
    try {
      aiResult = await this.aiService.analyzeSkillGap({ targetRole, currentSkills: userSkills });
    } catch {
      aiResult = { data: { gaps: [], roadmap: [] } };
    }

    const gapResult = await this.analyzeGap(userId, targetRole);
    const radarData = await this.getRadarChartData(userId, targetRole);

    return {
      targetRole,
      gaps: gapResult.gaps,
      matched: gapResult.matched,
      readiness: gapResult.readiness,
      radarData,
      roadmap: aiResult.data?.roadmap || [],
    };
  }
}
