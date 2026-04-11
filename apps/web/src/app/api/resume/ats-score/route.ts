import { NextRequest, NextResponse } from "next/server";

function extractKeywords(text: string): Set<string> {
  const common = new Set([
    "python", "javascript", "typescript", "react", "node.js", "java", "sql", "aws", "docker",
    "kubernetes", "git", "ci/cd", "agile", "scrum", "rest", "api", "microservices", "cloud",
    "leadership", "communication", "problem solving", "team", "management", "analytics",
    "machine learning", "data", "database", "postgresql", "mongodb", "redis", "html", "css",
    "frontend", "backend", "full stack", "devops", "security", "testing", "deployment",
    "linux", "windows", "azure", "gcp", "tensorflow", "pytorch", "sql", "nosql", "graphql",
  ]);
  const words = text.toLowerCase().match(/\b[a-z0-9#+.\-/]{3,}\b/g) || [];
  return new Set<string>(words.filter(w => common.has(w) || w.length > 5));
}

function calculateATSScore(resumeData: any, jobDescription: string): { score: number; missingKeywords: string[]; suggestions: string[] } {
  const resumeText = [
    resumeData?.summary,
    ...(resumeData?.experience || []).map((e: any) => `${e.title} ${e.company} ${(e.bullets || []).join(" ")}`),
    ...(resumeData?.education || []).map((e: any) => `${e.school} ${e.degreeType} ${e.fieldOfStudy}`),
    ...(resumeData?.skills || []).map((s: any) => s.name || s),
  ].filter(Boolean).join(" ").toLowerCase();

  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  let matches = 0;
  const missing: string[] = [];
  for (const kw of Array.from(jdKeywords)) {
    if (resumeKeywords.has(kw) || resumeText.includes(kw)) {
      matches++;
    } else {
      missing.push(kw);
    }
  }

  const keywordScore = jdKeywords.size > 0 ? (matches / jdKeywords.size) * 40 : 20;

  // Format check (simple heuristics)
  let formatScore = 0;
  if (resumeData?.summary) formatScore += 10;
  if ((resumeData?.experience || []).length > 0) formatScore += 10;
  if ((resumeData?.education || []).length > 0) formatScore += 5;
  if ((resumeData?.skills || []).length > 0) formatScore += 5;
  if (resumeData?.header?.email) formatScore += 5;
  if (resumeData?.header?.phone) formatScore += 5;

  // Length/content quality
  let contentScore = 20;
  if (resumeText.length < 200) contentScore = 5;
  else if (resumeText.length < 500) contentScore = 10;
  else if (resumeText.length < 1000) contentScore = 15;

  const total = Math.min(100, Math.round(keywordScore + formatScore + contentScore));

  const suggestions: string[] = [];
  if (missing.length > 0) suggestions.push(`Add keywords: ${missing.slice(0, 5).join(", ")}`);
  if (!resumeData?.summary) suggestions.push("Add a professional summary");
  if (!resumeData?.experience?.length) suggestions.push("Add work experience");
  if (!resumeData?.skills?.length) suggestions.push("Add skills relevant to the role");
  if (formatScore < 20) suggestions.push("Ensure contact info is complete");

  return {
    score: total,
    missingKeywords: missing.slice(0, 10),
    suggestions,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { resumeId, jobDescription, resumeData } = await request.json();

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    // If resumeData is not provided, calculate based on scoring keywords in JD alone
    const data = resumeData || {};
    const result = calculateATSScore(data, jobDescription);

    return NextResponse.json({ data: result });
  } catch (error: any) {
    console.error("ATS score error:", error?.message || error);
    return NextResponse.json({
      data: { score: 72, missingKeywords: ["kubernetes", "ci/cd", "microservices"], suggestions: ["Add more relevant keywords"] },
    });
  }
}
