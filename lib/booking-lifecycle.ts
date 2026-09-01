export const BOOKING_STATUSES = [
  "draft",
  "hold",
  "pending_payment",
  "confirmed",
  "vehicle_ready",
  "in_progress",
  "completed",
  "cancelled",
  "expired",
  "refunded",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "not_required",
  "pending",
  "authorized",
  "paid",
  "failed",
  "partially_refunded",
  "refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BOOKING_HOLD_MINUTES = 10;

const allowedTransitions: Record<BookingStatus, readonly BookingStatus[]> = {
  draft: ["hold", "cancelled"],
  hold: ["pending_payment", "confirmed", "expired", "cancelled"],
  pending_payment: ["confirmed", "expired", "cancelled"],
  confirmed: ["vehicle_ready", "cancelled"],
  vehicle_ready: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: ["refunded"],
  cancelled: ["refunded"],
  expired: [],
  refunded: [],
};

export function canTransitionBooking(
  from: BookingStatus,
  to: BookingStatus,
) {
  return allowedTransitions[from].includes(to);
}

export function assertBookingTransition(
  from: BookingStatus,
  to: BookingStatus,
) {
  if (!canTransitionBooking(from, to)) {
    throw new Error(`Booking cannot transition from ${from} to ${to}`);
  }
}

export function createBookingHoldExpiry(now = new Date()) {
  return new Date(now.getTime() + BOOKING_HOLD_MINUTES * 60_000);
}

export function isBookingHoldExpired(
  expiresAt: Date | string | null,
  now = new Date(),
) {
  if (!expiresAt) return false;
  const expiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  return Number.isNaN(expiry.getTime()) || expiry.getTime() <= now.getTime();
}
