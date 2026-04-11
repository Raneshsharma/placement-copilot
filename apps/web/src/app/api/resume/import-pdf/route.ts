import { NextRequest, NextResponse } from "next/server";

async function callClaude(system: string, user: string, apiKey: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-20250514",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.content?.[0]?.text?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (file.type === "application/pdf" && apiKey) {
      const text = `Resume file: ${file.name} (${Math.round(file.size / 1024)}KB)`;

      const systemPrompt = `You are a resume parser. Extract structured data from resume content. Return ONLY a valid JSON object with this exact structure:
{
  "header": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "company": "", "title": "", "period": "", "startDate": "", "endDate": "", "isCurrent": false, "bullets": [], "location": "" }],
  "education": [{ "school": "", "degreeType": "", "fieldOfStudy": "", "graduationDate": "", "gpa": "", "honors": "" }],
  "skills": [{ "name": "", "category": "technical" }],
  "certifications": [{ "name": "", "issuer": "", "date": "" }],
  "projects": [{ "name": "", "description": "", "technologies": [] }]
}
Return ONLY JSON, no markdown, no explanation. Empty strings for missing fields.`;

      const rawText = await file.text().catch(() => text);
      const parsed = await callClaude(systemPrompt, `Extract this resume and return JSON:\n\n${rawText.slice(0, 8000)}`, apiKey);

      if (parsed) {
        try {
          const cleanParsed = JSON.parse(parsed.replace(/```json\n?/g, "").replace(/```\n?/g, ""));
          return NextResponse.json({ data: { parsed: cleanParsed, raw: rawText } });
        } catch {
          // Fall through to fallback
        }
      }
    }

    // Fallback: return blank template
    return NextResponse.json({
      data: {
        parsed: {
          header: { name: "", email: "", phone: "", location: "", linkedin: "", github: "" },
          summary: "",
          experience: [],
          education: [],
          skills: [],
          certifications: [],
          projects: [],
        },
        raw: "",
        message: "File received. Fill in details manually or provide more context.",
      },
    });
  } catch (error: any) {
    console.error("Import PDF error:", error?.message || error);
    return NextResponse.json({ error: "Failed to import file" }, { status: 500 });
  }
}
