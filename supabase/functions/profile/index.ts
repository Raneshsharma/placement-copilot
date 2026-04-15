// Supabase Edge Function: Profile API
// Handles user profile CRUD operations

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
  headline?: string;
  location?: string;
  years_experience?: number;
  education?: string;
  skills?: string[];
  target_roles?: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    if (req.method === "GET") {
      // Get profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Profile doesn't exist, create default
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: user.email,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ data: newProfile }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: profile }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" || req.method === "PATCH") {
      // Update/create profile
      const body: ProfileInput = await req.json();

      const profileData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.first_name) profileData.first_name = body.first_name;
      if (body.last_name) profileData.last_name = body.last_name;
      if (body.email) profileData.email = body.email;
      if (body.phone) profileData.phone = body.phone;
      if (body.linkedin_url) profileData.linkedin_url = body.linkedin_url;
      if (body.github_url) profileData.github_url = body.github_url;
      if (body.portfolio_url) profileData.portfolio_url = body.portfolio_url;
      if (body.bio) profileData.bio = body.bio;
      if (body.headline) profileData.headline = body.headline;
      if (body.location) profileData.location = body.location;
      if (body.years_experience !== undefined) profileData.years_experience = body.years_experience;
      if (body.education) profileData.education = body.education;
      if (body.skills) profileData.skills = body.skills;
      if (body.target_roles) profileData.target_roles = body.target_roles;

      const { data: profile, error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          ...profileData,
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

      return new Response(JSON.stringify({ data: profile }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
