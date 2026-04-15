// Supabase Edge Function: Resume API
// Handles resume CRUD and AI-powered optimization

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_SERVICE_URL = Deno.env.get("AI_SERVICE_URL") || "https://placement-copilot.onrender.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // GET /api/resume - Get all resumes
    if (req.method === "GET" && path === "resume") {
      const { data: resumes, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: resumes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /api/resume - Create resume
    if (req.method === "POST" && path === "resume") {
      const body = await req.json();

      const { data: resume, error } = await supabase
        .from("resumes")
        .insert({
          user_id: userId,
          title: body.title || "Untitled Resume",
          content: body.content || {},
          is_default: body.is_default || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: resume }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /api/resume/generate-summary - AI-powered summary generation
    if (req.method === "POST" && path === "generate-summary") {
      const body = await req.json();
      const { prompt, currentSummary, resumeData } = body;

      try {
        const response = await fetch(`${AI_SERVICE_URL}/api/resume/summary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            current_summary: currentSummary,
            resume_data: resumeData,
          }),
        });

        if (!response.ok) {
          throw new Error("AI service unavailable");
        }

        const aiResult = await response.json();

        return new Response(JSON.stringify({ data: aiResult }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: "AI service unavailable",
          message: "Please try again later or use manual summary"
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // POST /api/resume/suggest-achievements - AI suggest achievements
    if (req.method === "POST" && path === "suggest-achievements") {
      const body = await req.json();
      const { jobTitle, company, bullets, existingAchievements } = body;

      try {
        const response = await fetch(`${AI_SERVICE_URL}/api/resume/achievements`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_title: jobTitle,
            company,
            bullets,
            existing_achievements: existingAchievements,
          }),
        });

        if (!response.ok) {
          throw new Error("AI service unavailable");
        }

        const aiResult = await response.json();

        return new Response(JSON.stringify({ data: aiResult }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: "AI service unavailable",
          message: "Please try again later"
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // POST /api/resume/ats-score - Calculate ATS score
    if (req.method === "POST" && path === "ats-score") {
      const body = await req.json();
      const { resumeId, roleId, jobDescription, resumeData } = body;

      try {
        const response = await fetch(`${AI_SERVICE_URL}/api/resume/ats-score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_id: resumeId,
            role_id: roleId,
            job_description: jobDescription,
            resume_data: resumeData,
          }),
        });

        if (!response.ok) {
          throw new Error("AI service unavailable");
        }

        const aiResult = await response.json();

        return new Response(JSON.stringify({ data: aiResult }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: "AI service unavailable",
          message: "Please try again later"
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // POST /api/resume/optimize - AI optimize resume
    if (req.method === "POST" && path === "optimize") {
      const body = await req.json();
      const { resumeId, jobDescription, targetRole, resumeData } = body;

      try {
        const response = await fetch(`${AI_SERVICE_URL}/api/resume/optimize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_id: resumeId,
            job_description: jobDescription,
            target_role: targetRole,
            resume_data: resumeData,
          }),
        });

        if (!response.ok) {
          throw new Error("AI service unavailable");
        }

        const aiResult = await response.json();

        // Save optimized version
        if (resumeId && aiResult.optimized_content) {
          await supabase
            .from("resumes")
            .update({
              content: aiResult.optimized_content,
              updated_at: new Date().toISOString(),
            })
            .eq("id", resumeId);
        }

        return new Response(JSON.stringify({ data: aiResult }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: "AI service unavailable",
          message: "Please try again later"
        }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
