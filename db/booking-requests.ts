import type { ValidatedBookingRequest } from "@/lib/booking";
import { riyadhDateToday } from "@/lib/booking";

type StoredBooking = {
  reference: string;
  status: string;
  estimated_total: number;
};

export type BookingReceipt = {
  reference: string;
  status: string;
  estimatedTotal: number;
  created: boolean;
};

async function getBookingDatabase() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) {
    throw new Error("Booking database is unavailable");
  }
  return env.DB;
}

async function findByIdempotencyKey(idempotencyKey: string) {
  const database = await getBookingDatabase();
  return database
    .prepare(
      `SELECT reference, status, estimated_total
       FROM booking_requests
       WHERE idempotency_key = ?1
       LIMIT 1`,
    )
    .bind(idempotencyKey)
    .first<StoredBooking>();
}

function toReceipt(row: StoredBooking, created: boolean): BookingReceipt {
  return {
    reference: row.reference,
    status: row.status,
    estimatedTotal: row.estimated_total,
    created,
  };
}

function makeReference() {
  const date = riyadhDateToday().replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `SYR-${date}-${suffix}`;
}

export async function createBookingRequest(
  booking: ValidatedBookingRequest,
): Promise<BookingReceipt> {
  const existing = await findByIdempotencyKey(booking.idempotencyKey);
  if (existing) return toReceipt(existing, false);

  const reference = makeReference();
  try {
    const database = await getBookingDatabase();
    await database
      .prepare(
        `INSERT INTO booking_requests (
          reference,
          idempotency_key,
          customer_first_name,
          customer_last_name,
          customer_mobile,
          pickup_mode,
          pickup_city,
          return_city,
          pickup_date,
          return_date,
          pickup_time,
          days,
          vehicle_category,
          daily_rate,
          estimated_total,
          locale
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)`,
      )
      .bind(
        reference,
        booking.idempotencyKey,
        booking.customerFirstName,
        booking.customerLastName,
        booking.customerMobile,
        booking.pickupMode,
        booking.pickupCity,
        booking.returnCity,
        booking.pickupDate,
        booking.returnDate,
        booking.pickupTime,
        booking.days,
        booking.vehicleCategory,
        booking.dailyRate,
        booking.estimatedTotal,
        booking.locale,
      )
      .run();
  } catch (error) {
    const duplicate = await findByIdempotencyKey(booking.idempotencyKey);
    if (duplicate) return toReceipt(duplicate, false);
    throw error;
  }

  return {
    reference,
    status: "pending_verification",
    estimatedTotal: booking.estimatedTotal,
    created: true,
  };
}
