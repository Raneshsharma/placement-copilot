import { cn, formatDate, calculateDaysAgo } from '../utils';

describe('cn() utility', () => {
  it('merges clsx and tailwind-merge for className strings', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class', !isActive && 'inactive-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
    expect(result).not.toContain('inactive-class');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles undefined and null values gracefully', () => {
    const result = cn('class1', undefined, null, 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });
});

describe('formatDate() utility', () => {
  it('formats a Date object correctly', () => {
    const date = new Date('2024-03-15');
    const result = formatDate(date);
    expect(result).toMatch(/Mar 15, 2024/);
  });

  it('formats an ISO string date correctly', () => {
    const result = formatDate('2024-12-25T10:30:00Z');
    expect(result).toMatch(/Dec 25, 2024/);
  });

  it('handles date string with time', () => {
    const result = formatDate('2024-06-01T00:00:00.000Z');
    expect(result).toMatch(/Jun 1, 2024/);
  });

  it('handles a date from 2025', () => {
    const result = formatDate('2025-01-10');
    expect(result).toMatch(/Jan 10, 2025/);
  });
});

describe('calculateDaysAgo() utility', () => {
  it('returns "Today" for the current date', () => {
    const today = new Date().toISOString();
    const result = calculateDaysAgo(today);
    expect(result).toBe('Today');
  });

  it('returns "1 day ago" for yesterday', () => {
    const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateDaysAgo(yesterday);
    expect(result).toBe('1 day ago');
  });

  it('returns "X days ago" for multiple days in the past', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateDaysAgo(fiveDaysAgo);
    expect(result).toBe('5 days ago');
  });

  it('handles a Date object', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = calculateDaysAgo(tenDaysAgo);
    expect(result).toBe('10 days ago');
  });

  it('handles dates far in the past', () => {
    const hundredDaysAgo = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateDaysAgo(hundredDaysAgo);
    expect(result).toBe('100 days ago');
  });
});
