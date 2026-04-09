"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  TrendingUp,
  FileText,
  Mic,
  Target,
  ClipboardList,
  BarChart3,
  CheckCircle,
  ChevronDown,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { ParticleBg } from "@/components/ui/particle-bg";

const features = [
  { icon: UserPlus, title: "Profile Builder", description: "Create a standout professional profile that highlights your unique strengths and career goals." },
  { icon: TrendingUp, title: "Placement Score", description: "Get a personalized PPS score that quantifies your job readiness and tracks improvement over time." },
  { icon: FileText, title: "Resume Optimizer", description: "AI-powered resume analysis that matches your experience to job requirements with ATS scoring." },
  { icon: Mic, title: "Mock Interviews", description: "Practice with AI-generated questions and get instant, detailed feedback on your responses." },
  { icon: Target, title: "Skill Gap Analyzer", description: "Identify exactly what skills you need to close the gap between you and your dream role." },
  { icon: ClipboardList, title: "Application Tracker", description: "Organize and track every application with a visual Kanban board across 8 pipeline stages." },
  { icon: BarChart3, title: "Progress Dashboard", description: "Monitor your placement journey with detailed analytics, streaks, and motivational insights." },
];

const steps = [
  { num: "01", icon: UserPlus, title: "Build Your Profile", description: "Upload your resume or fill in your details. AI parses your skills, experience, and goals to create a comprehensive profile." },
  { num: "02", icon: TrendingUp, title: "Get Your PPS Score", description: "Receive a Placement Potential Score based on profile completeness, skill alignment, resume quality, and interview readiness." },
  { num: "03", icon: Target, title: "Match & Apply", description: "AI matches you to roles with the highest fit score, tailors your resume, and guides you through interviews." },
];

const testimonials = [
  { name: "Priya Sharma", role: "SWE at Google", avatar: "PS", quote: "Placement Copilot helped me go from 0 to 3 interviews in 2 weeks. The resume ATS scoring made a huge difference.", rating: 5 },
  { name: "Marcus Chen", role: "Frontend at Meta", avatar: "MC", quote: "The mock interview feedback was so detailed — it caught things I never would have noticed on my own.", rating: 5 },
  { name: "Aisha Patel", role: "PM at Stripe", avatar: "AP", quote: "The skill gap analyzer told me exactly what to learn. Closed a gap in system design in 3 weeks.", rating: 5 },
];

const faqs = [
  { q: "Is Placement Copilot AI free to use?", a: "Yes! The core features are completely free. We offer a Pro plan for power users who need unlimited AI generations, advanced analytics, and priority support." },
  { q: "How does the AI resume optimization work?", a: "Upload your resume and a job listing. Our AI analyzes keyword matches, formatting, and content quality, then rewrites your resume tailored specifically for that role." },
  { q: "How accurate is the Placement Potential Score?", a: "The PPS is based on real data from thousands of successful placements. It factors in your profile completeness, skill alignment with market demand, resume quality, and interview readiness." },
  { q: "Can I practice specific interview types?", a: "Absolutely. Choose from Behavioral, Technical, System Design, Mixed, or LeetCode-style questions. Each session generates real-time feedback with dimension scores." },
  { q: "What companies use Placement Copilot?", a: "Our users have been hired at Google, Meta, Amazon, Stripe, Airbnb, Notion, Figma, Linear, and hundreds of other companies across tech, finance, and product." },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <ParticleBg />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[6px] bg-primary flex items-center justify-center shadow-glow">
              <TrendingUp className="w-5 h-5 text-[#3c2f00]" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">Placement Copilot</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden sm:block text-sm font-medium text-text-secondary hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hidden sm:block text-sm font-medium text-text-secondary hover:text-primary transition-colors">How It Works</a>
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm font-medium px-4 py-2 bg-primary text-[#3c2f00] rounded-[6px] hover:bg-primary/90 transition-colors shadow-glow">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20 shadow-glow-sm">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Placement
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] mb-6">
            Your Career Deserves a
            <br />
            <span className="text-gradient-gold"> Better Plan.</span>
          </h1>
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            Placement Copilot AI helps students and professionals land their dream jobs with personalized guidance,
            AI-powered resume optimization, mock interviews, and real-time application tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-[#3c2f00] font-semibold rounded-[6px] hover:bg-primary/90 transition-all text-lg shadow-glow flex items-center justify-center gap-2 animate-fade-in">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-surface text-text-primary font-semibold rounded-[6px] border border-border hover:border-primary/30 transition-all text-lg flex items-center justify-center gap-2 animate-fade-in stagger-2">
              See How It Works <ChevronDown className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-text-tertiary">No credit card required · Free forever plan available</p>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-10 px-6 border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider">Trusted by students from</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Stripe"].map((c) => (
              <span key={c} className="text-lg font-bold text-text-tertiary/40">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-surfaceContainer">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["50,000+", "Students Supported"], ["92%", "Interview Rate"], ["4.9/5", "Student Rating"], ["500+", "Dream Roles Matched"]].map(([val, label]) => (
            <div key={label} className="animate-fade-in">
              <p className="font-display text-3xl font-bold text-primary mb-1">{val}</p>
              <p className="text-sm text-text-secondary">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              From Profile to Offer in 3 Steps
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Our AI guides you through every step of your placement journey, from building your profile to acing interviews.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 w-8 border-t-2 border-dashed border-border z-0" />
                )}
                <div className="relative z-10 bg-surface rounded-lg p-6 border border-border hover:shadow-glow transition-all duration-300 group">
                  <div className="text-5xl font-display font-bold text-primary/10 mb-3 group-hover:text-primary/15 transition-colors">{step.num}</div>
                  <div className="w-12 h-12 rounded-[6px] bg-primary/10 flex items-center justify-center mb-4 shadow-glow-sm group-hover:bg-primary/15 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-surfaceContainer">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Features</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              A complete toolkit powered by AI to guide you through every step of your placement journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-surface p-6 rounded-lg border border-border hover:shadow-glow hover:border-primary/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-11 h-11 rounded-[6px] bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:shadow-glow-sm transition-all duration-300">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Loved by Students Worldwide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-surface p-6 rounded-lg border border-border hover:shadow-glow transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shadow-glow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-tertiary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-surfaceContainer">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-colors">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-text-primary pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-text-secondary shrink-0 transition-all duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 shadow-glow-sm">
            <Shield className="w-3.5 h-3.5" />
            Free forever plan · No credit card required
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Start Your Placement Journey Today
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
            Join 50,000+ students who have already accelerated their career with Placement Copilot AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-10 py-4 bg-primary text-[#3c2f00] font-semibold rounded-[6px] hover:bg-primary/90 transition-all text-lg shadow-glow flex items-center justify-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="text-text-secondary hover:text-primary transition-colors text-sm font-medium">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border bg-surfaceContainer">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-primary flex items-center justify-center shadow-glow-sm">
              <TrendingUp className="w-4 h-4 text-[#3c2f00]" />
            </div>
            <span className="font-display font-bold text-text-primary">Placement Copilot AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-text-tertiary">&copy; {new Date().getFullYear()} Placement Copilot AI</p>
        </div>
      </footer>
    </div>
  );
}
