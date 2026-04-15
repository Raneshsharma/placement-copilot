import { NextRequest, NextResponse } from "next/server";

const MOCK_JOBS = [
  { id: "1", company: "Google", role: "Software Engineer", location: "Mountain View, CA", salary: "$120k - $180k", postedAt: "2 days ago", match: 92, skills: ["Python", "Go", "Distributed Systems"], type: "Full-time" },
  { id: "2", company: "Stripe", role: "Product Manager", location: "San Francisco, CA", salary: "$130k - $190k", postedAt: "1 day ago", match: 88, skills: ["Product Strategy", "Data Analysis", "SQL"], type: "Full-time" },
  { id: "3", company: "Notion", role: "Senior Designer", location: "Remote", salary: "$100k - $150k", postedAt: "3 days ago", match: 85, skills: ["Figma", "Design Systems", "Prototyping"], type: "Full-time" },
  { id: "4", company: "Meta", role: "Frontend Engineer", location: "Menlo Park, CA", salary: "$110k - $160k", postedAt: "5 days ago", match: 91, skills: ["React", "TypeScript", "CSS"], type: "Full-time" },
  { id: "5", company: "Airbnb", role: "Data Scientist", location: "Remote", salary: "$115k - $165k", postedAt: "1 week ago", match: 82, skills: ["Python", "Machine Learning", "SQL"], type: "Full-time" },
  { id: "6", company: "Spotify", role: "Backend Engineer", location: "New York, NY", salary: "$105k - $155k", postedAt: "4 days ago", match: 79, skills: ["Java", "Kubernetes", "AWS"], type: "Full-time" },
  { id: "7", company: "Figma", role: "Full Stack Engineer", location: "San Francisco, CA", salary: "$125k - $175k", postedAt: "6 days ago", match: 87, skills: ["React", "Node.js", "GraphQL"], type: "Full-time" },
  { id: "8", company: "Linear", role: "iOS Engineer", location: "Remote", salary: "$115k - $160k", postedAt: "2 weeks ago", match: 76, skills: ["Swift", "SwiftUI", "Combine"], type: "Full-time" },
  { id: "9", company: "Vercel", role: "DevOps Engineer", location: "Remote", salary: "$120k - $170k", postedAt: "3 days ago", match: 83, skills: ["Next.js", "Docker", "Terraform"], type: "Full-time" },
  { id: "10", company: "Anthropic", role: "ML Engineer", location: "San Francisco, CA", salary: "$150k - $220k", postedAt: "1 day ago", match: 90, skills: ["PyTorch", "LLMs", "Python"], type: "Full-time" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const filtered = q ? MOCK_JOBS.filter((j) => j.role.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase())) : MOCK_JOBS;
  // Return in `items` format to match roles page expectations
  return NextResponse.json({ items: filtered, data: filtered });
}
