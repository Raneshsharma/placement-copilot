"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, Bell, Mail, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { profileApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const STEPS = [
  { id: 1, label: "Intent" },
  { id: 2, label: "About You" },
  { id: 3, label: "Target Roles" },
  { id: 4, label: "Resume" },
  { id: 5, label: "Preferences" },
];

const INTENT_OPTIONS = [
  {
    id: "student",
    title: "Student",
    description: "Currently studying and preparing for placement",
    icon: "🎓",
  },
  {
    id: "career-switch",
    title: "Switching Careers",
    description: "Looking to transition into a new field",
    icon: "🔄",
  },
  {
    id: "level-up",
    title: "Level Up",
    description: "Seeking advancement in your current field",
    icon: "🚀",
  },
];

const EXPERIENCE_LEVELS = [
  "Fresher (0 years)",
  "1-2 years",
  "3-5 years",
  "5-8 years",
  "8+ years",
];

const EDUCATION_LEVELS = [
  "High School",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D. / Doctorate",
];

const ROLE_OPTIONS = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Business Analyst",
  "Sales Executive",
  "Marketing Manager",
  "Financial Analyst",
];

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Media & Entertainment",
  "Consulting",
  "Manufacturing",
  "Real Estate",
  "Government",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentRole: "",
    experienceLevel: "",
    educationLevel: "",
    targetRoles: [] as string[],
    industries: [] as string[],
    resumeFile: null as File | null,
    notifications: {
      applicationUpdates: true,
      interviewReminders: true,
      weeklyDigest: false,
      jobRecommendations: true,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const progress = (step / 5) * 100;

  const handleRoleToggle = (role: string, field: "targetRoles" | "industries") => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(role)) {
        return { ...prev, [field]: current.filter((r) => r !== role) };
      }
      return { ...prev, [field]: [...current, role] };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await profileApi.create({
        intent,
        ...formData,
      });
      router.push("/dashboard");
    } catch {
      // Onboarding failed, still redirect to dashboard for MVP
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">Placement Copilot</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Let&apos;s get you started
          </h1>
          <p className="text-text-secondary mt-1">Step {step} of 5 &mdash; {STEPS[step - 1].label}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`text-xs font-medium ${
                  s.id <= step ? "text-primary" : "text-text-tertiary"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-surface rounded-lg border border-border p-8">
          {/* Step 1: Intent */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                  What&apos;s your primary goal?
                </h2>
                <p className="text-text-secondary text-sm">
                  This helps us tailor your experience from day one.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {INTENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setIntent(option.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      intent === option.id
                        ? "border-primary bg-primary-light"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <h3 className="font-semibold text-text-primary">{option.title}</h3>
                        <p className="text-sm text-text-secondary mt-0.5">{option.description}</p>
                      </div>
                      {intent === option.id && (
                        <div className="ml-auto text-primary">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: About You */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-text-secondary text-sm">
                  Help us understand your background so we can better assist you.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentRole">Current Role / Student Status</Label>
                  <Input
                    id="currentRole"
                    placeholder="e.g. Computer Science Student"
                    value={formData.currentRole}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(val) => setFormData({ ...formData, experienceLevel: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Education Level</Label>
                  <Select
                    value={formData.educationLevel}
                    onValueChange={(val) => setFormData({ ...formData, educationLevel: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Target Roles */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                  What roles are you targeting?
                </h2>
                <p className="text-text-secondary text-sm">
                  Select all that apply. You can always update this later.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-text-secondary mb-2">Target Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleToggle(role, "targetRoles")}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          formData.targetRoles.includes(role)
                            ? "bg-primary text-white border-primary"
                            : "bg-surface border-border hover:border-primary/30 text-text-secondary"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-text-secondary mb-2">Industries</h3>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRY_OPTIONS.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => handleRoleToggle(industry, "industries")}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          formData.industries.includes(industry)
                            ? "bg-secondary text-white border-secondary"
                            : "bg-surface border-border hover:border-secondary/30 text-text-secondary"
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Resume Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                  Upload your resume
                </h2>
                <p className="text-text-secondary text-sm">
                  We&apos;ll analyze it to personalize your experience. Supports PDF, DOCX.
                </p>
              </div>
              <div
                className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => document.getElementById("resume-upload")?.click()}
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFormData({ ...formData, resumeFile: file });
                  }}
                />
                <Upload className="w-10 h-10 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-primary font-medium mb-1">
                  {formData.resumeFile ? formData.resumeFile.name : "Drop your resume here or click to upload"}
                </p>
                <p className="text-text-tertiary text-sm">PDF or DOCX up to 10MB</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert("AI analysis will be connected to the AI service in production.");
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze My Resume
              </Button>
            </div>
          )}

          {/* Step 5: Preferences */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="font-display text-xl font-bold text-text-primary mb-2">
                  Set your preferences
                </h2>
                <p className="text-text-secondary text-sm">
                  Choose how you want to be notified and guided.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { key: "applicationUpdates", label: "Application Updates", desc: "Get notified when application status changes" },
                  { key: "interviewReminders", label: "Interview Reminders", desc: "Receive reminders before scheduled interviews" },
                  { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your placement progress each week" },
                  { key: "jobRecommendations", label: "Job Recommendations", desc: "Personalized role suggestions based on your profile" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={item.key}
                        checked={formData.notifications[item.key as keyof typeof formData.notifications]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            notifications: {
                              ...formData.notifications,
                              [item.key]: checked === true,
                            },
                          })
                        }
                      />
                      <div>
                        <Label htmlFor={item.key} className="font-medium text-text-primary cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-xs text-text-secondary">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-text-tertiary">
                      {item.key === "applicationUpdates" && <Mail className="w-4 h-4" />}
                      {item.key === "interviewReminders" && <Bell className="w-4 h-4" />}
                      {item.key === "weeklyDigest" && <Mail className="w-4 h-4" />}
                      {item.key === "jobRecommendations" && <Sparkles className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !intent}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Setting up..." : "Finish Setup"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
