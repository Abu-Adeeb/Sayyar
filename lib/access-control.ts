export const PORTAL_PERMISSIONS = [
  "dashboard.read",
  "bookings.read",
  "bookings.manage",
  "partners.read",
  "partners.manage",
  "vehicles.read",
  "vehicles.manage",
  "branches.read",
  "branches.manage",
  "branch_ratings.read",
  "reports.read",
  "users.read",
  "users.manage",
  "roles.manage",
  "integrations.read",
  "integrations.manage",
] as const;

export type PortalPermission = (typeof PORTAL_PERMISSIONS)[number];
export type PortalScope = "sayyar" | "partner";

export type AccessContext = {
  scope: PortalScope;
  organizationId: number | null;
  branchIds: readonly number[];
  permissions: readonly PortalPermission[];
};

export type ScopedResource = {
  organizationId?: number | null;
  branchId?: number | null;
};

export const DEFAULT_ROLES = {
  sayyar_admin: PORTAL_PERMISSIONS,
  sayyar_operations: [
    "dashboard.read",
    "bookings.read",
    "bookings.manage",
    "partners.read",
    "partners.manage",
    "branches.read",
    "branch_ratings.read",
    "reports.read",
    "integrations.read",
  ],
  partner_manager: [
    "dashboard.read",
    "bookings.read",
    "bookings.manage",
    "vehicles.read",
    "vehicles.manage",
    "branches.read",
    "branches.manage",
    "branch_ratings.read",
    "reports.read",
    "users.read",
    "users.manage",
    "roles.manage",
    "integrations.read",
    "integrations.manage",
  ],
  partner_branch_agent: [
    "dashboard.read",
    "bookings.read",
    "bookings.manage",
    "vehicles.read",
    "branches.read",
    "branch_ratings.read",
  ],
} as const satisfies Record<string, readonly PortalPermission[]>;

export function canAccess(
  context: AccessContext,
  permission: PortalPermission,
  resource: ScopedResource = {},
) {
  if (!context.permissions.includes(permission)) return false;
  if (context.scope === "sayyar") return true;

  if (
    resource.organizationId != null &&
    context.organizationId !== resource.organizationId
  ) {
    return false;
  }

  if (
    resource.branchId != null &&
    context.branchIds.length > 0 &&
    !context.branchIds.includes(resource.branchId)
  ) {
    return false;
  }

  return true;
}
