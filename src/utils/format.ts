import type { PriceUnit } from '../types';
import { PRICE_UNIT_SHORT } from '../constants/textures';

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? '';
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** e.g. "₹1,850 / sq ft" — or null when no price is set. */
export function formatPrice(amount: number | null, unit: PriceUnit): string | null {
  if (amount === null) return null;
  return `${rupees.format(amount)} / ${PRICE_UNIT_SHORT[unit]}`;
}
