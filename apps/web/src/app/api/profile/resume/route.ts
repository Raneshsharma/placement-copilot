import { NextResponse } from "next/server";

const MOCK_RESUME = {
  header: { name: "Alex Johnson", email: "alex@example.com", phone: "+1 555 123 4567", location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson", github: "github.com/alexjohnson" },
  summary: "Motivated software engineer with 3 years of experience building scalable web applications. Passionate about clean code and user experience.",
  experience: [
    { company: "TechCorp", title: "Software Engineer", period: "Jan 2022 – Present", bullets: ["Led development of customer-facing dashboard serving 50K users", "Reduced API response times by 40% through database optimization"] },
    { company: "StartupXYZ", title: "Frontend Developer", period: "Jun 2020 – Dec 2021", bullets: ["Built responsive web app from scratch using React and TypeScript"] },
  ],
  education: [{ school: "UC Berkeley", degree: "B.S. Computer Science", year: "2020", gpa: "3.7" }],
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Git"],
};

export async function GET() {
  return NextResponse.json({ data: MOCK_RESUME });
}
