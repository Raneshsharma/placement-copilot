// Supabase Edge Function: AI Service Wrapper
// Proxies requests to the AI backend and provides fallback responses

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_SERVICE_URL = Deno.env.get("AI_SERVICE_URL") || "https://placement-copilot.onrender.com";
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";

// Mock responses when AI service is unavailable
const MOCK_RESPONSES = {
  "/api/resume/summary": {
    summary: "Results-driven professional with strong technical skills and proven ability to deliver high-quality work. Demonstrates excellent problem-solving capabilities and effective communication skills. Committed to continuous learning and professional growth.",
    keywords: ["leadership", "problem-solving", "communication", "technical"],
  },
  "/api/resume/achievements": {
    achievements: [
      "Increased team productivity by 40% through implementing efficient workflows",
      "Reduced system downtime by 60% via proactive monitoring solutions",
      "Led cross-functional team of 5 to deliver project 2 weeks ahead of schedule",
    ],
  },
  "/api/resume/ats-score": {
    score: 78,
    breakdown: {
      keywords: 85,
      format: 90,
      experience: 75,
      education: 80,
    },
    suggestions: [
      "Add more action verbs to bullet points",
      "Include more quantifiable metrics",
      "Ensure keywords match job description",
    ],
  },
  "/api/skills/analyze": {
    required_skills: ["JavaScript", "React", "Node.js", "Database", "API Design"],
    gap: [
      { skill: "System Design", priority: "high", time: "4 weeks" },
      { skill: "TypeScript", priority: "medium", time: "2 weeks" },
    ],
    roadmap: [
      { week: 1, topic: "JavaScript Fundamentals" },
      { week: 2, topic: "React Framework" },
      { week: 3, topic: "Backend Development" },
      { week: 4, topic: "Database & APIs" },
    ],
  },
  "/api/interview/prepare": {
    topics: [
      "Behavioral Questions",
      "Technical Fundamentals",
      "System Design",
      "Problem Solving",
    ],
    common_questions: [
      "Tell me about yourself",
      "Why this company?",
      "Describe a challenge you overcame",
      "Where do you see yourself in 5 years?",
    ],
    tips: [
      "Use the STAR method for behavioral questions",
      "Research the company thoroughly",
      "Prepare thoughtful questions for the interviewer",
    ],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const aiPath = url.searchParams.get("path") || "/api/ai/default";

    // Try AI service first
    try {
      const response = await fetch(`${AI_SERVICE_URL}${aiPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(ANTHROPIC_API_KEY ? { "Authorization": `Bearer ${ANTHROPIC_API_KEY}` } : {}),
        },
        body: await req.text(),
      });

      if (response.ok) {
        const result = await response.json();
        return new Response(JSON.stringify({ ...result, source: "ai_service" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      // AI service unavailable, use mock
    }

    // Return mock response
    const mockKey = Object.keys(MOCK_RESPONSES).find(key => aiPath.includes(key));
    if (mockKey) {
      return new Response(JSON.stringify({
        ...MOCK_RESPONSES[mockKey as keyof typeof MOCK_RESPONSES],
        source: "mock",
        message: "AI service unavailable. This is a preview response.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      error: "AI service unavailable",
      message: "The AI service is currently down. Please try again later.",
      fallback_available: true,
    }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
