import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { statusCode: 400, message: "Email and password are required", error: { message: "Email and password are required" } },
        { status: 400 }
      );
    }

    // Get Supabase keys from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return NextResponse.json(
        { statusCode: 500, message: "Server configuration error", error: { message: "Database not configured. Please contact support." } },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { statusCode: 401, message: "Invalid credentials", error: { message: error.message } },
        { status: 401 }
      );
    }

    // Get user profile
    let firstName = "";
    let lastName = "";

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile) {
      firstName = profile.first_name || "";
      lastName = profile.last_name || "";
    }

    const accessToken = generateToken();
    const refreshToken = generateToken();

    const response = NextResponse.json({
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName,
          lastName,
          role: "USER"
        },
        accessToken,
        refreshToken,
        session: data.session,
      },
    });

    response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 86400 });
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    response.cookies.set("auth-token", accessToken, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 86400 });

    return response;

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { statusCode: 500, message: "Internal server error", error: { message: error.message || "Login failed. Please try again." } },
      { status: 500 }
    );
  }
}

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}