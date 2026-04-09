import type { ApiResponse, PaginatedResponse } from '../types/index.js';

export function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createApiError(code: string, message: string, details?: Record<string, unknown>): ApiResponse<never> {
  return {
    success: false,
    error: { code, message, details },
    timestamp: new Date().toISOString(),
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  totalItems: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

export function calculateCompleteness(profile: Record<string, unknown>): number {
  const fields = [
    'headline', 'summary', 'location', 'phone',
    'linkedinUrl', 'githubUrl', 'portfolioUrl',
    'skills', 'experience', 'education',
    'targetRoles', 'targetLocations',
  ];

  let filled = 0;
  for (const field of fields) {
    const value = profile[field];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        filled++;
      } else if (!Array.isArray(value)) {
        filled++;
      }
    }
  }

  return Math.round((filled / fields.length) * 100);
}
