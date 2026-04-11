import type { ApiResponse, PaginatedResponse } from '../types/index.js';

// ============================================================
// Date Formatters
// ============================================================

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d);
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(d);
}

export function daysSince(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================
// Score Formatters
// ============================================================

export function formatPPS(score: number): string {
  return `${Math.round(score)}`;
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// ============================================================
// Status Helpers
// ============================================================

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: '#94a3b8',
    SUBMITTED: '#3b82f6',
    UNDER_REVIEW: '#f59e0b',
    INTERVIEW: '#8b5cf6',
    OFFERED: '#10b981',
    REJECTED: '#ef4444',
    WITHDRAWN: '#6b7280',
  };
  return colors[status] ?? '#6b7280';
}

export function getMatchColor(percentage: number): string {
  if (percentage >= 70) return '#10b981';
  if (percentage >= 40) return '#f59e0b';
  return '#ef4444';
}

// ============================================================
// Profile Completeness
// ============================================================

export function calculateProfileCompleteness(profile: Record<string, unknown>): number {
  const fields = ['headline', 'summary', 'skills', 'experience', 'education', 'certifications'];
  const filled = fields.filter(f => {
    const val = profile[f];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  });
  return Math.round((filled.length / fields.length) * 100);
}

// ============================================================
// API Response Helpers
// ============================================================

export function createApiResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return { data, meta };
}

export function createApiError(statusCode: number, message: string, error: string): ApiResponse<never> {
  return { data: undefined, error: { statusCode, message, error } };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  totalItems: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// ============================================================
// Misc Utilities
// ============================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}