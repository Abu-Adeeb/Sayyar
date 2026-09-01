import assert from "node:assert/strict";
import test from "node:test";

import {
  canAccess,
  DEFAULT_ROLES,
} from "../lib/access-control.ts";
import {
  canTransitionBooking,
  createBookingHoldExpiry,
  isBookingHoldExpired,
} from "../lib/booking-lifecycle.ts";
import {
  requireIntegration,
  UnconfiguredIntegrationError,
} from "../lib/integrations.ts";

test("booking holds expire after ten minutes", () => {
  const now = new Date("2026-09-01T10:00:00.000Z");
  const expiry = createBookingHoldExpiry(now);

  assert.equal(expiry.toISOString(), "2026-09-01T10:10:00.000Z");
  assert.equal(isBookingHoldExpired(expiry, new Date("2026-09-01T10:09:59.000Z")), false);
  assert.equal(isBookingHoldExpired(expiry, new Date("2026-09-01T10:10:00.000Z")), true);
});

test("booking lifecycle blocks unsafe state jumps", () => {
  assert.equal(canTransitionBooking("hold", "pending_payment"), true);
  assert.equal(canTransitionBooking("confirmed", "vehicle_ready"), true);
  assert.equal(canTransitionBooking("confirmed", "completed"), false);
  assert.equal(canTransitionBooking("expired", "confirmed"), false);
});

test("partner users are restricted to their organization and branches", () => {
  const context = {
    scope: "partner",
    organizationId: 7,
    branchIds: [11, 12],
    permissions: DEFAULT_ROLES.partner_branch_agent,
  };

  assert.equal(canAccess(context, "bookings.read", { organizationId: 7, branchId: 11 }), true);
  assert.equal(canAccess(context, "bookings.read", { organizationId: 8, branchId: 11 }), false);
  assert.equal(canAccess(context, "bookings.read", { organizationId: 7, branchId: 99 }), false);
  assert.equal(canAccess(context, "users.manage", { organizationId: 7 }), false);
});

test("external services fail closed until a provider is configured", () => {
  assert.throws(
    () => requireIntegration({}, "payment"),
    (error) => error instanceof UnconfiguredIntegrationError,
  );
});
