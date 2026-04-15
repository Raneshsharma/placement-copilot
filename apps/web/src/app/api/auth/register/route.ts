import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://drhbfttubncvlhljqnsy.supabase.co",
  process.env.SUPABASE_ANON_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { statusCode: 400, message: "All fields are required", error: { message: "All fields are required" } },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { statusCode: 400, message: "Invalid email format", error: { message: "Please enter a valid email address" } },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { statusCode: 400, message: "Password too short", error: { message: "Password must be at least 6 characters" } },
        { status: 400 }
      );
    }

    // Check if user already exists in profiles table
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { statusCode: 409, message: "Email already in use", error: { message: "An account with this email already exists" } },
        { status: 409 }
      );
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://web-kappa-three-ll2pbh23qd.vercel.app"}/onboarding`,
      },
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return NextResponse.json(
        { statusCode: 400, message: authError.message, error: { message: authError.message } },
        { status: 400 }
      );
    }

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    // Return success response (user needs to verify email unless email_confirm is true)
    return NextResponse.json({
      data: {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          firstName,
          lastName,
        } : null,
        session: authData.session,
      },
      message: "Registration successful! Please check your email to verify your account.",
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { statusCode: 500, message: "Internal server error", error: { message: "Registration failed. Please try again." } },
      { status: 500 }
    );
  }
}