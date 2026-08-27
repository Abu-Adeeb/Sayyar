import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const bookingRequests = sqliteTable(
  "booking_requests",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    customerFirstName: text("customer_first_name").notNull(),
    customerLastName: text("customer_last_name").notNull(),
    customerMobile: text("customer_mobile").notNull(),
    pickupMode: text("pickup_mode").notNull(),
    pickupCity: text("pickup_city").notNull(),
    returnCity: text("return_city").notNull(),
    pickupDate: text("pickup_date").notNull(),
    returnDate: text("return_date").notNull(),
    pickupTime: text("pickup_time").notNull(),
    days: integer("days").notNull(),
    vehicleCategory: text("vehicle_category").notNull(),
    dailyRate: integer("daily_rate").notNull(),
    estimatedTotal: integer("estimated_total").notNull(),
    locale: text("locale").notNull(),
    status: text("status").notNull().default("pending_verification"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("booking_requests_reference_unique").on(table.reference),
    uniqueIndex("booking_requests_idempotency_key_unique").on(table.idempotencyKey),
    index("booking_requests_mobile_idx").on(table.customerMobile),
    index("booking_requests_status_idx").on(table.status),
    index("booking_requests_created_at_idx").on(table.createdAt),
  ],
);
