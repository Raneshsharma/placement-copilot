import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert resume writer. Generate a compelling, ATS-friendly professional summary based on the provided information. Keep it to 2-4 sentences, max 400 characters. Focus on achievements, skills, and value proposition. Do NOT use markdown or bullet points.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentSummary, resumeData } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    let context = "";
    if (resumeData) {
      const { header, title, experience, education, skills } = resumeData;
      context = `
Candidate Info:
- Name: ${header?.name || "Not provided"}
- Title: ${title || "Not provided"}
- Experience: ${experience?.map((e: any) => `${e.title} at ${e.company} (${e.period || "present"}). ${(e.bullets || []).slice(0, 2).join(" ")}`).join(" | ") || "None provided"}
- Education: ${education?.map((e: any) => `${e.degreeType} in ${e.fieldOfStudy} from ${e.school}`).join(", ") || "None provided"}
- Skills: ${(skills || []).map((s: any) => s.name || s).join(", ") || "None provided"}
`;
    }

    const userPrompt = currentSummary
      ? `Improve this professional summary:\n"${currentSummary}"\n\nContext:\n${context}\n\nRewrite it to be more compelling and ATS-optimized. Keep it 2-4 sentences.`
      : `Write a professional summary for this candidate:\n${context}\n\n${prompt || "Write a compelling 2-4 sentence summary that highlights their value."}`;

    if (!apiKey) {
      // Fallback without API
      return NextResponse.json({
        data: {
          summary: currentSummary ||
            "Results-driven professional with a strong track record of delivering high-impact solutions. Skilled in modern technologies with a passion for continuous learning and team collaboration.",
        },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-20250514",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json({
        data: {
          summary: currentSummary ||
            "Results-driven professional with strong expertise and proven ability to deliver high-impact results.",
        },
      });
    }

    const result = await response.json();
    const summary = result.content?.[0]?.text?.trim() || currentSummary || "";

    return NextResponse.json({ data: { summary } });
  } catch (error: any) {
    console.error("Generate summary error:", error?.message || error);
    return NextResponse.json({
      data: {
        summary: "Results-driven professional with strong expertise and a proven ability to deliver high-impact results. Passionate about continuous growth and collaboration.",
      },
    });
  }
}
