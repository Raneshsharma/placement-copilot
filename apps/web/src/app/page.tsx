"use client";

import Link from "next/link";
import {
  UserPlus,
  TrendingUp,
  FileText,
  Mic,
  Target,
  ClipboardList,
  BarChart3,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Profile Builder",
    description: "Create a standout professional profile that highlights your unique strengths and career goals.",
  },
  {
    icon: TrendingUp,
    title: "Placement Score",
    description: "Get a personalized PPS score that quantifies your job readiness and tracks improvement.",
  },
  {
    icon: FileText,
    title: "Resume Optimizer",
    description: "AI-powered resume analysis that matches your experience to job requirements.",
  },
  {
    icon: Mic,
    title: "Mock Interviews",
    description: "Practice with AI-generated questions and get instant feedback on your responses.",
  },
  {
    icon: Target,
    title: "Skill Gap Analyzer",
    description: "Identify exactly what skills you need to land your dream role.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description: "Organize and track every application with a visual Kanban board.",
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    description: "Monitor your placement journey with detailed analytics and insights.",
  },
];

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">
              Placement Copilot
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-[10px] hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            AI-Powered Career Placement
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
            Your Career Deserves a Better Plan.
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Placement Copilot AI helps students and professionals land their dream jobs with personalized guidance,
            AI-powered resume optimization, mock interviews, and real-time application tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-[10px] hover:bg-primary/90 transition-colors text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white text-text-primary font-semibold rounded-[10px] border border-border hover:border-primary/30 transition-colors text-lg"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-surfaceAlt">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              A complete toolkit powered by AI to guide you through every step of your placement journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-12">
            <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              Trusted by students from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {companies.map((company) => (
                <span key={company} className="text-xl font-bold text-text-tertiary/50">
                  {company}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="font-display text-4xl font-bold text-primary mb-2">50,000+</div>
              <p className="text-text-secondary text-sm">Students Placed</p>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-primary mb-2">92%</div>
              <p className="text-text-secondary text-sm">Interview Rate</p>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-primary mb-2">4.9/5</div>
              <p className="text-text-secondary text-sm">Student Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Placement Journey Today
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already accelerated their career with Placement Copilot AI.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-[10px] hover:bg-surfaceAlt transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-text-primary">
                Placement Copilot
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary">
              <Link href="#" className="hover:text-primary transition-colors">About</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-text-tertiary">
              &copy; {new Date().getFullYear()} Placement Copilot AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
