import { NextRequest, NextResponse } from "next/server";

const SKILL_DATABASES: Record<string, string[]> = {
  "Software Engineer": ["TypeScript", "JavaScript", "React", "Node.js", "Python", "Java", "Go", "Rust", "PostgreSQL", "MongoDB", "Redis", "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Git", "CI/CD", "REST APIs", "GraphQL", "System Design", "Microservices", "Agile", "Scrum", "TDD", "SQL"],
  "Frontend Developer": ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML", "CSS", "SASS", "Tailwind CSS", "Next.js", "Nuxt.js", "Redux", "Zustand", "Jest", "Playwright", "Webpack", "Vite", "REST APIs", "GraphQL", "Responsive Design", "Accessibility", "Web Performance"],
  "Full Stack Developer": ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "REST APIs", "GraphQL", "Next.js", "Express", "Prisma", "Sequelize", "Git", "CI/CD", "Redis", "Testing"],
  "Backend Developer": ["Node.js", "Python", "Java", "Go", "Rust", "PostgreSQL", "MongoDB", "Redis", "Kafka", "RabbitMQ", "AWS", "Docker", "Kubernetes", "REST APIs", "GraphQL", "gRPC", "Microservices", "CI/CD", "System Design", "Security"],
  "Data Scientist": ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "Keras", "Spark", "Hadoop", "Tableau", "Power BI", "Statistics", "Machine Learning", "Deep Learning", "NLP", "Data Visualization", "A/B Testing", "ETL"],
  "Product Manager": ["Product Strategy", "Roadmapping", "Agile", "Scrum", "User Research", "A/B Testing", "Data Analysis", "SQL", "Jira", "Figma", "Stakeholder Management", "Competitive Analysis", "Market Research", "OKRs", "Prioritization"],
  "DevOps Engineer": ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "CI/CD", "Linux", "Shell Scripting", "Monitoring", "Prometheus", "Grafana", "ELK Stack", "Security", "Networking"],
  "UX Designer": ["Figma", "Sketch", "Adobe XD", "User Research", "Wireframing", "Prototyping", "UI Design", "Interaction Design", "Design Systems", "Accessibility", "Usability Testing", "Information Architecture", "Figma", "HTML/CSS", "Design Thinking"],
  "default": ["JavaScript", "TypeScript", "Python", "SQL", "Git", "REST APIs", "Problem Solving", "Communication", "Leadership", "Agile", "Data Analysis"],
};

function calculateMatchScore(skills: string[], targetRole: string): number {
  const targetSkills = new Set<string>(SKILL_DATABASES[targetRole] || SKILL_DATABASES.default);
  const skillSet = new Set<string>(skills.map(s => s.toLowerCase()));
  let matches = 0;
  for (const ts of Array.from(targetSkills)) {
    if (skillSet.has(ts.toLowerCase())) matches++;
  }
  const coverage = matches / targetSkills.size;
  return Math.round(Math.min(95, coverage * 100));
}

function getMissingKeywords(skills: string[], targetRole: string): string[] {
  const targetSkills = new Set<string>(SKILL_DATABASES[targetRole] || SKILL_DATABASES.default);
  const skillSet = new Set<string>(skills.map(s => s.toLowerCase()));
  return Array.from(targetSkills).filter((ts: string) => !skillSet.has(ts.toLowerCase())).slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, experience, skills } = await request.json();

    const currentSkills = (skills || []).map((s: any) => s.name || s);
    const role = jobTitle || "default";

    const score = calculateMatchScore(currentSkills, role);
    const missing = getMissingKeywords(currentSkills, role);
    const suggested = Array.from(new Set<string>([
      ...(SKILL_DATABASES[role] || SKILL_DATABASES.default).filter((s: string) => !currentSkills.map((cs: string) => cs.toLowerCase()).includes(s.toLowerCase())),
    ])).slice(0, 8);

    return NextResponse.json({
      data: {
        score,
        matchedSkills: currentSkills,
        suggestedSkills: suggested,
        missingKeywords: missing,
        role,
      },
    });
  } catch (error: any) {
    console.error("Match skills error:", error?.message || error);
    return NextResponse.json({
      data: {
        score: 0,
        matchedSkills: [],
        suggestedSkills: SKILL_DATABASES.default,
        missingKeywords: SKILL_DATABASES.default,
      },
    });
  }
}
