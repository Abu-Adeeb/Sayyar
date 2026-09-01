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

export const organizations = sqliteTable(
  "organizations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("organizations_slug_unique").on(table.slug)],
);

export const branches = sqliteTable(
  "branches",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en").notNull(),
    city: text("city").notNull(),
    status: text("status").notNull().default("active"),
    ratingBasisPoints: integer("rating_basis_points").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("branches_organization_idx").on(table.organizationId),
    index("branches_city_idx").on(table.city),
  ],
);

export const portalUsers = sqliteTable(
  "portal_users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    externalSubject: text("external_subject").notNull(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    status: text("status").notNull().default("invited"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("portal_users_external_subject_unique").on(table.externalSubject),
    uniqueIndex("portal_users_email_unique").on(table.email),
    index("portal_users_organization_idx").on(table.organizationId),
  ],
);

export const roles = sqliteTable(
  "roles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    key: text("key").notNull(),
    nameAr: text("name_ar").notNull(),
    nameEn: text("name_en").notNull(),
    scope: text("scope").notNull(),
    permissionsJson: text("permissions_json").notNull().default("[]"),
    isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("roles_organization_key_unique").on(table.organizationId, table.key),
    index("roles_scope_idx").on(table.scope),
  ],
);

export const userRoleAssignments = sqliteTable(
  "user_role_assignments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => portalUsers.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    branchId: integer("branch_id").references(() => branches.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("user_role_assignments_unique").on(table.userId, table.roleId, table.branchId),
    index("user_role_assignments_branch_idx").on(table.branchId),
  ],
);

export const vehicles = sqliteTable(
  "vehicles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    externalVehicleId: text("external_vehicle_id"),
    make: text("make").notNull(),
    model: text("model").notNull(),
    modelYear: integer("model_year").notNull(),
    category: text("category").notNull(),
    fuelType: text("fuel_type").notNull(),
    dailyRate: integer("daily_rate").notNull(),
    status: text("status").notNull().default("available"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("vehicles_organization_idx").on(table.organizationId),
    index("vehicles_branch_status_idx").on(table.branchId, table.status),
  ],
);

export const bookings = sqliteTable(
  "bookings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull(),
    bookingRequestId: integer("booking_request_id").references(() => bookingRequests.id),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branches.id),
    vehicleId: integer("vehicle_id").references(() => vehicles.id),
    customerName: text("customer_name").notNull(),
    customerMobile: text("customer_mobile").notNull(),
    status: text("status").notNull().default("draft"),
    paymentStatus: text("payment_status").notNull().default("not_required"),
    pickupAt: text("pickup_at").notNull(),
    returnAt: text("return_at").notNull(),
    pickupMode: text("pickup_mode").notNull(),
    totalAmount: integer("total_amount").notNull(),
    holdExpiresAt: text("hold_expires_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("bookings_reference_unique").on(table.reference),
    index("bookings_organization_status_idx").on(table.organizationId, table.status),
    index("bookings_branch_status_idx").on(table.branchId, table.status),
    index("bookings_customer_mobile_idx").on(table.customerMobile),
  ],
);

export const bookingEvents = sqliteTable(
  "booking_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    actorUserId: integer("actor_user_id").references(() => portalUsers.id),
    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),
    note: text("note"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("booking_events_booking_idx").on(table.bookingId)],
);

export const branchRatings = sqliteTable(
  "branch_ratings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    branchId: integer("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    bookingId: integer("booking_id").references(() => bookings.id),
    score: integer("score").notNull(),
    issueCategory: text("issue_category"),
    comment: text("comment"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("branch_ratings_branch_idx").on(table.branchId),
    index("branch_ratings_organization_idx").on(table.organizationId),
  ],
);

export const integrationConnections = sqliteTable(
  "integration_connections",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    organizationId: integer("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    kind: text("kind").notNull(),
    provider: text("provider"),
    status: text("status").notNull().default("not_configured"),
    secretReference: text("secret_reference"),
    lastHealthcheckAt: text("last_healthcheck_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("integration_connections_org_kind_unique").on(
      table.organizationId,
      table.kind,
    ),
    index("integration_connections_status_idx").on(table.status),
  ],
);

export const partnerApplications = sqliteTable(
  "partner_applications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reference: text("reference").notNull(),
    legalName: text("legal_name").notNull(),
    commercialRegistration: text("commercial_registration").notNull(),
    contactName: text("contact_name").notNull(),
    contactMobile: text("contact_mobile").notNull(),
    contactEmail: text("contact_email").notNull(),
    city: text("city").notNull(),
    status: text("status").notNull().default("draft"),
    resumeTokenHash: text("resume_token_hash"),
    submittedAt: text("submitted_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("partner_applications_reference_unique").on(table.reference),
    uniqueIndex("partner_applications_cr_unique").on(table.commercialRegistration),
    index("partner_applications_status_idx").on(table.status),
  ],
);
