import { NextRequest, NextResponse } from "next/server";

const MOCK_JOBS: Record<string, any> = {
  "1": { id: "1", company: "Google", role: "Software Engineer II", location: "Mountain View, CA", salary: "$120,000 – $180,000", match: 85, description: "We're looking for a Software Engineer II to join our Core Infrastructure team.", requirements: [{ name: "Python", required: true }, { name: "System Design", required: true }], benefits: ["Health Insurance", "401k Match", "Unlimited PTO", "Remote Work"] },
  "r1": { id: "r1", company: "Meta", role: "Frontend Engineer", location: "Menlo Park, CA", salary: "$110k - $160k", match: 91 },
  "r2": { id: "r2", company: "Stripe", role: "Backend Engineer", location: "Remote", salary: "$100k - $150k", match: 89 },
  "r3": { id: "r3", company: "Notion", role: "Full Stack Engineer", location: "San Francisco, CA", salary: "$90k - $130k", match: 87 },
};

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const job = MOCK_JOBS[params.id] || MOCK_JOBS["1"];
  return NextResponse.json({ data: job });
}
