"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Linkedin, Check, ArrowRight, FileText } from "lucide-react";
import { resumeApi } from "@/lib/api";
import styles from "./onboarding-welcome.module.css";

type ScreenState = "choose" | "upload" | "loading" | "success" | "error" | "coming_soon";

export default function OnboardingEntryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [screenState, setScreenState] = useState<ScreenState>("choose");
  const [selectedMethod, setSelectedMethod] = useState<"resume" | "linkedin" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Open file picker immediately when upload screen is active
  const openFilePicker = () => fileInputRef.current?.click();

  const handleResumeStart = () => {
    setSelectedMethod("resume");
    setScreenState("upload");
    // Open the file picker immediately
    setTimeout(openFilePicker, 50);
  };

  const handleLinkedInStart = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    if (clientId) {
      setSelectedMethod("linkedin");
      const redirectUri = `${window.location.origin}/onboarding/linkedin/callback`;
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    } else {
      // No client ID configured — show a clear "coming soon" state
      setSelectedMethod("linkedin");
      setScreenState("coming_soon");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please upload a PDF or DOCX file.");
      setScreenState("error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File must be smaller than 10MB.");
      setScreenState("error");
      return;
    }

    setFileName(file.name);
    setScreenState("loading");

    try {
      const response = await resumeApi.importPdf(file);
      const data = response.data?.data ?? response.data;
      if (data?.profile) {
        router.push("/onboarding/confirm");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: { message?: string }; message?: string }; message?: string }; message?: string };
      const msg = axiosErr?.response?.data?.error?.message || axiosErr?.response?.data?.message || axiosErr?.message || "Something went wrong.";
      setErrorMessage(msg);
      setScreenState("error");
    }
  };

  const handleDropClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetry = () => {
    setErrorMessage(null);
    setFileName(null);
    setScreenState("upload");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Brand mark */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span className={styles.brandName}>Placement Copilot</span>
      </div>

      {/* Main content */}
      <div className={styles.container}>
        <h1 className={styles.heading}>Let&apos;s set up your profile.</h1>
        <p className={styles.subheading}>
          Share your resume or connect your LinkedIn. We&apos;ll use it to build your profile, improve your resume, and give you personalized career guidance — faster.
        </p>

        {/* State: Choose between Resume or LinkedIn */}
        {(screenState === "choose" || screenState === "upload") && (
          <div className={styles.cardsGrid}>
            {/* Resume Card */}
            <div
              className={styles.card}
              onClick={screenState === "choose" ? handleResumeStart : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleResumeStart(); }}
            >
              <div className={styles.cardIcon}>
                <Upload size={24} color="#D97706" />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Upload Resume</h2>
                <p className={styles.cardDescription}>
                  Drop in your current resume and let our AI analyze it, strengthen your bullet points, and help you build a job-winning profile.
                </p>
              </div>
              <button
                className={styles.cardButton}
                onClick={(e) => { e.stopPropagation(); handleResumeStart(); }}
              >
                Start with Resume
                <ArrowRight size={16} />
              </button>
            </div>

            {/* LinkedIn Card */}
            <div
              className={styles.card}
              onClick={screenState === "choose" ? handleLinkedInStart : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLinkedInStart(); }}
            >
              <div className={styles.cardIcon}>
                <Linkedin size={24} color="#D97706" />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Connect LinkedIn</h2>
                <p className={styles.cardDescription}>
                  Import your experience, education, and skills from LinkedIn to automatically set up your profile and get personalized career guidance.
                </p>
              </div>
              <button
                className={styles.cardButton}
                onClick={(e) => { e.stopPropagation(); handleLinkedInStart(); }}
              >
                Start with LinkedIn
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Build from Scratch Card */}
            <div
              className={styles.card}
              onClick={() => router.push("/resume/builder?from=onboarding")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push("/resume/builder?from=onboarding"); }}
            >
              <div className={styles.cardIcon}>
                <FileText size={24} color="#D97706" />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Build from Scratch</h2>
                <p className={styles.cardDescription}>
                  No existing resume? Start fresh with our AI-powered builder — we&apos;ll guide you step by step.
                </p>
              </div>
              <button
                className={styles.cardButton}
                onClick={(e) => { e.stopPropagation(); router.push("/resume/builder?from=onboarding"); }}
              >
                Start from Scratch
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* State: File upload area */}
        {screenState === "upload" && selectedMethod === "resume" && (
          <div className={styles.uploadContainer}>
            <div className={styles.uploadArea} onClick={handleDropClick}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className={styles.uploadInput}
                onChange={handleFileChange}
              />
              <div className={styles.uploadIcon}>
                <Upload size={32} />
              </div>
              <p className={styles.uploadText}>
                {fileName ? fileName : "Drop your resume here or click to upload"}
              </p>
              <p className={styles.uploadHint}>PDF or DOCX up to 10MB</p>
            </div>
            <button
              className={styles.skipLink}
              onClick={handleSkip}
              aria-label="Skip for now and go to dashboard"
            >
              I&apos;ll do this later
            </button>
          </div>
        )}

        {/* State: Loading */}
        {screenState === "loading" && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>
              {selectedMethod === "resume"
                ? "Analyzing your resume..."
                : "Importing your profile..."}
            </p>
          </div>
        )}

        {/* State: Success */}
        {screenState === "success" && (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <Check size={24} color="#16a34a" />
            </div>
            <p className={styles.successText}>
              {selectedMethod === "resume" ? "Resume analyzed!" : "Profile imported!"}
            </p>
          </div>
        )}

        {/* State: Error */}
        {screenState === "error" && (
          <div className={styles.errorState}>
            <p className={styles.errorText}>{errorMessage}</p>
            {selectedMethod === "resume" && (
              <button className={styles.errorRetry} onClick={handleRetry} aria-label="Try uploading again">
                Try again
              </button>
            )}
            <button
              className={styles.skipLink}
              onClick={handleSkip}
              aria-label="Skip for now and go to dashboard"
            >
              I&apos;ll do this later
            </button>
          </div>
        )}

        {/* State: Coming Soon (LinkedIn not configured) */}
        {screenState === "coming_soon" && (
          <div className={styles.comingSoonState}>
            <div className={styles.comingSoonIcon}>
              <Linkedin size={28} color="#0077B5" />
            </div>
            <p className={styles.comingSoonTitle}>LinkedIn integration is coming soon</p>
            <p className={styles.comingSoonDescription}>
              We&apos;re working on connecting your LinkedIn profile. For now, try uploading your resume or building from scratch.
            </p>
            <div className={styles.comingSoonActions}>
              <button
                className={styles.comingSoonPrimary}
                onClick={handleResumeStart}
              >
                Upload Resume
              </button>
              <button
                className={styles.comingSoonSecondary}
                onClick={() => router.push("/resume/builder?from=onboarding")}
              >
                Build from Scratch
              </button>
            </div>
            <button
              className={styles.skipLink}
              onClick={handleSkip}
              aria-label="Skip for now and go to dashboard"
            >
              I&apos;ll do this later
            </button>
          </div>
        )}

        {/* Skip link for choose state */}
        {screenState === "choose" && (
          <button
            className={styles.skipLink}
            onClick={handleSkip}
            aria-label="Skip for now and go to dashboard"
          >
            I&apos;ll do this later
          </button>
        )}
      </div>
    </div>
  );
}
