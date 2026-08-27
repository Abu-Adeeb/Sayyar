import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeSaudiMobile,
  validateBookingRequest,
} from "../lib/booking.ts";

const now = new Date("2026-08-27T09:00:00.000Z");
const validPayload = {
  idempotencyKey: "request_key_1234567890",
  customerFirstName: "محمد",
  customerLastName: "العنزي",
  customerMobile: "0551234567",
  pickupMode: "branch",
  pickupCity: "riyadh",
  returnCity: "jeddah",
  pickupDate: "2026-08-28",
  pickupTime: "10:00",
  days: 3,
  vehicleCategory: "compact",
  locale: "ar",
};

test("normalizes supported Saudi mobile formats", () => {
  assert.equal(normalizeSaudiMobile("055 123 4567"), "966551234567");
  assert.equal(normalizeSaudiMobile("+966551234567"), "966551234567");
  assert.equal(normalizeSaudiMobile("00966-55-123-4567"), "966551234567");
  assert.equal(normalizeSaudiMobile("551234567"), "966551234567");
});

test("validates a booking and calculates dates and price on the server", () => {
  const result = validateBookingRequest(
    { ...validPayload, dailyRate: 1, estimatedTotal: 1 },
    now,
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.customerMobile, "966551234567");
  assert.equal(result.value.returnDate, "2026-08-31");
  assert.equal(result.value.dailyRate, 164);
  assert.equal(result.value.estimatedTotal, 492);
});

test("rejects dates in the past", () => {
  const result = validateBookingRequest(
    { ...validPayload, pickupDate: "2026-08-26" },
    now,
  );

  assert.deepEqual(result, {
    ok: false,
    field: "pickupDate",
    message: "Pickup date is outside the allowed range",
  });
});

test("rejects invalid rental details", () => {
  assert.equal(validateBookingRequest({ ...validPayload, days: 31 }, now).ok, false);
  assert.equal(
    validateBookingRequest({ ...validPayload, customerMobile: "123" }, now).ok,
    false,
  );
  assert.equal(
    validateBookingRequest({ ...validPayload, vehicleCategory: "luxury" }, now).ok,
    false,
  );
});
