// Server-side permission checks for the admin panel.
// NEVER trust a client-supplied role — always re-derive from the DB session.

export const ADMIN_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  EDITOR: "EDITOR",
  SEO_MANAGER: "SEO_MANAGER",
  ANALYTICS_VIEWER: "ANALYTICS_VIEWER"
};

// Map of resource -> roles allowed to write to it.
// Read access to the admin shell itself is allowed to any authenticated admin;
// these govern mutation endpoints.
const WRITE_PERMISSIONS = {
  blog: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.EDITOR],
  media: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.EDITOR],
  seo: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.SEO_MANAGER],
  redirects: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.SEO_MANAGER],
  tools: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.SEO_MANAGER],
  settings: [ADMIN_ROLES.SUPER_ADMIN],
  users: [ADMIN_ROLES.SUPER_ADMIN],
  analytics: [
    ADMIN_ROLES.SUPER_ADMIN,
    ADMIN_ROLES.ANALYTICS_VIEWER,
    ADMIN_ROLES.EDITOR,
    ADMIN_ROLES.SEO_MANAGER
  ],
  revenue: [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ANALYTICS_VIEWER]
};

export function canWrite(role, resource) {
  const allowed = WRITE_PERMISSIONS[resource];
  if (!allowed) return false;
  return allowed.includes(role);
}

export function assertCanWrite(role, resource) {
  if (!canWrite(role, resource)) {
    const err = new Error(`Role ${role} is not permitted to modify ${resource}`);
    err.status = 403;
    throw err;
  }
}
