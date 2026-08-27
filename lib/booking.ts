export const BOOKING_CITIES = [
  "riyadh",
  "jeddah",
  "dammam",
  "makkah",
  "madinah",
] as const;

export const PICKUP_MODES = ["branch", "delivery", "taxi"] as const;
export const BOOKING_LOCALES = ["ar", "en"] as const;
export const VEHICLE_CATEGORIES = ["economy", "compact", "family"] as const;

export const CATEGORY_DAILY_RATES = {
  economy: 128,
  compact: 164,
  family: 238,
} as const;

export type BookingCity = (typeof BOOKING_CITIES)[number];
export type PickupMode = (typeof PICKUP_MODES)[number];
export type BookingLocale = (typeof BOOKING_LOCALES)[number];
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export type ValidatedBookingRequest = {
  idempotencyKey: string;
  customerFirstName: string;
  customerLastName: string;
  customerMobile: string;
  pickupMode: PickupMode;
  pickupCity: BookingCity;
  returnCity: BookingCity;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  days: number;
  vehicleCategory: VehicleCategory;
  dailyRate: number;
  estimatedTotal: number;
  locale: BookingLocale;
};

export type BookingValidationResult =
  | { ok: true; value: ValidatedBookingRequest }
  | { ok: false; field: string; message: string };

const MAX_ADVANCE_DAYS = 365;
const MAX_RENTAL_DAYS = 30;

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  options: T,
): value is T[number] {
  return typeof value === "string" && options.includes(value as T[number]);
}

function cleanName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function addBookingDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function riyadhDateToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function normalizeSaudiMobile(value: unknown) {
  if (typeof value !== "string") return null;

  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00966")) digits = digits.slice(2);
  if (/^05\d{8}$/.test(digits)) digits = `966${digits.slice(1)}`;
  if (/^5\d{8}$/.test(digits)) digits = `966${digits}`;

  return /^9665\d{8}$/.test(digits) ? digits : null;
}

export function validateBookingRequest(
  payload: unknown,
  now = new Date(),
): BookingValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, field: "request", message: "Invalid request body" };
  }

  const input = payload as Record<string, unknown>;
  const idempotencyKey =
    typeof input.idempotencyKey === "string" ? input.idempotencyKey.trim() : "";
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(idempotencyKey)) {
    return { ok: false, field: "idempotencyKey", message: "Invalid request key" };
  }

  const customerFirstName = cleanName(input.customerFirstName);
  if (customerFirstName.length < 2 || customerFirstName.length > 60) {
    return { ok: false, field: "customerFirstName", message: "Invalid first name" };
  }

  const customerLastName = cleanName(input.customerLastName);
  if (customerLastName.length < 2 || customerLastName.length > 60) {
    return { ok: false, field: "customerLastName", message: "Invalid last name" };
  }

  const customerMobile = normalizeSaudiMobile(input.customerMobile);
  if (!customerMobile) {
    return { ok: false, field: "customerMobile", message: "Invalid Saudi mobile number" };
  }

  if (!isOneOf(input.pickupMode, PICKUP_MODES)) {
    return { ok: false, field: "pickupMode", message: "Invalid pickup mode" };
  }
  if (!isOneOf(input.pickupCity, BOOKING_CITIES)) {
    return { ok: false, field: "pickupCity", message: "Invalid pickup city" };
  }
  if (!isOneOf(input.returnCity, BOOKING_CITIES)) {
    return { ok: false, field: "returnCity", message: "Invalid return city" };
  }
  if (!isOneOf(input.vehicleCategory, VEHICLE_CATEGORIES)) {
    return { ok: false, field: "vehicleCategory", message: "Invalid vehicle category" };
  }
  if (!isOneOf(input.locale, BOOKING_LOCALES)) {
    return { ok: false, field: "locale", message: "Invalid locale" };
  }

  if (!isValidIsoDate(input.pickupDate)) {
    return { ok: false, field: "pickupDate", message: "Invalid pickup date" };
  }
  const today = riyadhDateToday(now);
  const lastAllowedDate = addBookingDays(today, MAX_ADVANCE_DAYS);
  if (input.pickupDate < today || input.pickupDate > lastAllowedDate) {
    return { ok: false, field: "pickupDate", message: "Pickup date is outside the allowed range" };
  }

  if (
    typeof input.days !== "number" ||
    !Number.isInteger(input.days) ||
    input.days < 1 ||
    input.days > MAX_RENTAL_DAYS
  ) {
    return { ok: false, field: "days", message: "Invalid rental duration" };
  }

  if (typeof input.pickupTime !== "string" || !/^(?:0[8-9]|1\d|20):00$/.test(input.pickupTime)) {
    return { ok: false, field: "pickupTime", message: "Invalid pickup time" };
  }

  const dailyRate = CATEGORY_DAILY_RATES[input.vehicleCategory];
  return {
    ok: true,
    value: {
      idempotencyKey,
      customerFirstName,
      customerLastName,
      customerMobile,
      pickupMode: input.pickupMode,
      pickupCity: input.pickupCity,
      returnCity: input.returnCity,
      pickupDate: input.pickupDate,
      returnDate: addBookingDays(input.pickupDate, input.days),
      pickupTime: input.pickupTime,
      days: input.days,
      vehicleCategory: input.vehicleCategory,
      dailyRate,
      estimatedTotal: dailyRate * input.days,
      locale: input.locale,
    },
  };
}
