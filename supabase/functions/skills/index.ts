// Supabase Edge Function: Skills API
// Handles skill gap analysis and roadmap generation

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
    const pathSegments = url.pathname.split("/").filter(Boolean);

    // GET /api/skills - Get user skills
    if (req.method === "GET" && pathSegments[pathSegments.length - 1] === "skills") {
      const { data: skills, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", userId)
        .order("category", { ascending: true });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: skills || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /api/skills - Add skill
    if (req.method === "POST" && pathSegments[pathSegments.length - 1] === "skills") {
      const body = await req.json();

      const { data: skill, error } = await supabase
        .from("skills")
        .insert({
          user_id: userId,
          name: body.name,
          category: body.category || "technical",
          proficiency: body.proficiency || 1,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: skill }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /api/skills/analyze - AI-powered skill gap analysis
    if (req.method === "POST" && pathSegments.includes("analyze")) {
      const body = await req.json();
      const { targetRole, currentSkills } = body;

      // Try AI service first
      try {
        const response = await fetch(`${AI_SERVICE_URL}/api/skills/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target_role: targetRole,
            current_skills: currentSkills,
          }),
        });

        if (response.ok) {
          const aiResult = await response.json();

          // Save analysis to database
          await supabase
            .from("skill_analyses")
            .insert({
              user_id: userId,
              target_role: targetRole,
              current_skills: currentSkills,
              required_skills: aiResult.required_skills || [],
              gap: aiResult.gap || [],
              roadmap: aiResult.roadmap || [],
              created_at: new Date().toISOString(),
            });

          return new Response(JSON.stringify({ data: aiResult }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        // AI service unavailable, return mock analysis
      }

      // Fallback: Basic skill gap analysis
      const mockAnalysis = {
        target_role: targetRole,
        current_skills: currentSkills || [],
        required_skills: [
          "JavaScript/TypeScript",
          "React/Next.js",
          "Node.js",
          "Database (SQL/NoSQL)",
          "API Design",
        ],
        gap: [
          { skill: "TypeScript", priority: "high", estimated_time: "2-3 weeks" },
          { skill: "System Design", priority: "medium", estimated_time: "3-4 weeks" },
        ],
        roadmap: [
          { week: 1, focus: "TypeScript fundamentals" },
          { week: 2, focus: "Advanced TypeScript patterns" },
          { week: 3, focus: "System design basics" },
          { week: 4, focus: "API best practices" },
        ],
        ai_powered: false,
        message: "AI analysis unavailable. This is a basic analysis. Enable AI service for detailed recommendations.",
      };

      return new Response(JSON.stringify({ data: mockAnalysis }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
