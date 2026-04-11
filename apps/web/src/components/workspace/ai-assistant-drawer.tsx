"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Sparkles, MessageSquare, Lightbulb, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisCategory, AnalysisIssue } from "@/types/analysis";
import styles from "./ai-assistant-drawer.module.css";

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: AnalysisCategory | null;
  selectedIssue: AnalysisIssue | null;
  messages: { id: string; role: "user" | "assistant"; content: string; timestamp: number }[];
  inputValue: string;
  onInputChange: (text: string) => void;
  onSend: (text: string) => void;
  isLoading: boolean;
}

function getContextLabel(category: AnalysisCategory | null, issue: AnalysisIssue | null): string {
  if (issue) return `Issue: ${issue.headline}`;
  if (category) return `Category: ${category.name}`;
  return "Resume Overview";
}

function getQuickPrompts(category: AnalysisCategory | null, issue: AnalysisIssue | null): { label: string; prompt: string; icon: React.ElementType }[] {
  if (issue) {
    return [
      { label: "Rewrite with AI", prompt: `Rewrite this with stronger action verbs: "${issue.context.split("\n").pop()}"`, icon: Zap },
      { label: "Add impact", prompt: `Add measurable impact to: "${issue.context.split("\n").pop()}"`, icon: Target },
      { label: "Simplify", prompt: `Simplify this bullet point: "${issue.context.split("\n").pop()}"`, icon: Lightbulb },
      { label: "ATS optimize", prompt: `Optimize this for ATS: "${issue.context.split("\n").pop()}"`, icon: Sparkles },
    ];
  }

  if (category) {
    const prompts: Record<string, string[]> = {
      "impact": ["What makes a strong impact statement?", "Help me quantify my achievements", "Show me examples of great impact bullets"],
      "keywords": ["What keywords am I missing?", "How do I optimize for ATS?", "What terms should I add?"],
      "summary": ["Help me write a stronger summary", "What should my summary include?", "Show me a better summary format"],
      "structure": ["How should I organize my resume?", "What order should sections go in?", "Help me optimize my layout"],
      "formatting": ["How can I improve my formatting?", "What font and spacing should I use?", "Make my resume more scannable"],
    };
    const catPrompts = prompts[category.id] || ["What issues were found in this section?", "Give me actionable suggestions", "How can I improve this?"];
    return [
      { label: "Explain issues", prompt: catPrompts[0], icon: MessageSquare },
      { label: "Get suggestions", prompt: catPrompts[1], icon: Lightbulb },
      { label: "See examples", prompt: catPrompts[2], icon: Zap },
      { label: "Improve now", prompt: `Help me improve my ${category.name.toLowerCase()} section`, icon: Target },
    ];
  }

  return [
    { label: "Analyze my resume", prompt: "Analyze my resume and tell me the top 3 things to fix", icon: MessageSquare },
    { label: "What to fix first", prompt: "What should I prioritize fixing on my resume?", icon: Zap },
    { label: "ATS tips", prompt: "Give me tips to improve my ATS score", icon: Sparkles },
    { label: "Suggest a role", prompt: "What job titles or roles would be a good fit based on my resume?", icon: Target },
  ];
}

export function AiAssistantDrawer({
  isOpen,
  onClose,
  selectedCategory,
  selectedIssue,
  messages,
  inputValue,
  onInputChange,
  onSend,
  isLoading,
}: AiAssistantDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleQuickPrompt = (prompt: string) => {
    onSend(prompt);
  };

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSend(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = getQuickPrompts(selectedCategory ?? null, selectedIssue ?? null);
  const contextLabel = getContextLabel(selectedCategory ?? null, selectedIssue ?? null);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="AI Career Coach">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className={styles.headerTitle}>AI Career Coach</h2>
              <p className={styles.headerContext}>{contextLabel}</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close AI help">
            <X size={18} />
          </button>
        </div>

        {/* Quick prompts */}
        <div className={styles.quickPrompts}>
          <p className={styles.quickPromptsLabel}>Quick actions</p>
          <div className={styles.quickPromptsGrid}>
            {quickPrompts.map((qp, i) => {
              const Icon = qp.icon;
              return (
                <button
                  key={i}
                  type="button"
                  className={styles.quickPromptBtn}
                  onClick={() => handleQuickPrompt(qp.prompt)}
                  disabled={isLoading}
                >
                  <Icon size={14} />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <MessageSquare size={32} className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                Ask me anything about your resume. I&apos;ll help you improve it.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={cn(styles.message, msg.role === "user" ? styles.messageUser : styles.messageAssistant)}>
              <div className={styles.messageBubble}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={cn(styles.message, styles.messageAssistant)}>
              <div className={styles.messageBubble}>
                <div className={styles.loadingDots}>
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Ask me anything about your resume..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Message AI assistant"
          />
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={16} className={styles.spinner} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
