import { describe, it, expect } from '@jest/globals';
import { cn, formatDate, calculateDaysAgo } from './utils';

describe('cn()', () => {
  it('merges class names with clsx', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles tailwind conflicting classes', () => {
    const result = cn('px-2 px-4');
    expect(result).toBe('px-4');
  });

  it('handles conditional classes', () => {
    const conditional = true;
    const result = cn('base-class', conditional && 'conditional-class', false && 'falsy-class');
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-class');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate()', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-03-15');
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2024-03-15'));
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
  });

  it('handles invalid date gracefully', () => {
    const result = formatDate('not-a-date');
    expect(typeof result).toBe('string');
  });
});

describe('calculateDaysAgo()', () => {
  it('returns "Today" for current date', () => {
    const result = calculateDaysAgo(new Date());
    expect(result).toBe('Today');
  });

  it('returns "1 day ago" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000);
    const result = calculateDaysAgo(yesterday);
    expect(result).toBe('1 day ago');
  });

  it('returns N days ago for older dates', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
    const result = calculateDaysAgo(threeDaysAgo);
    expect(result).toBe('3 days ago');
  });

  it('handles string date input', () => {
    const result = calculateDaysAgo('2024-01-01');
    expect(result).toMatch(/days ago/);
  });
});
