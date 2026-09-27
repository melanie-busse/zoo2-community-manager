import { Session } from "next-auth";

/**
 * Role hierarchy (lower ID = more permissions)
 * 0 = Mayor  (special: read-only demo mode)
 * 1 = Admin
 * 2 = Director
 * 3 = Employee
 * 4 = Member
 * 5 = Visitor
 */
const ROLE_IDS: Record<string, number> = {
  Admin: 1,
  Director: 2,
  Employee: 3,
  Member: 4,
  Visitor: 5,
};

/**
 * Returns true if the session user has at least the given minimum role.
 * Mayor (roleId 0) is excluded from write operations — handle separately.
 * Anonymous users (no session) always return false.
 */
export function hasMinimumRole(
  session: Session | null,
  minimumRole: "Visitor" | "Member" | "Employee" | "Director" | "Admin",
): boolean {
  if (!session?.user?.roleId) return false;

  const userRoleId = session.user.roleId;
  const requiredRoleId = ROLE_IDS[minimumRole];

  // Mayor (0) is a special read-only role — never counts as having write permissions
  if (userRoleId === 0) return false;

  return userRoleId <= requiredRoleId;
}

/**
 * Returns true if the user is the Mayor (read-only demo mode).
 */
export function isMayor(session: Session | null): boolean {
  return session?.user?.roleId === 0 || session?.user?.role === "Mayor";
}