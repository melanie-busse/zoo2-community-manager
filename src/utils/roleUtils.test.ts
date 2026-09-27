import { describe, test, expect } from "vitest";
import { hasMinimumRole, isMayor } from "./roleUtils";
import { Session } from "next-auth";

const makeSession = (roleId: number, role: string): Session => ({
  user: { roleId, role, name: "Test", email: "test@example.com", image: null },
  expires: "9999-12-31",
});

describe("hasMinimumRole", () => {
  test("gibt false zurück wenn keine Session vorhanden ist", () => {
    expect(hasMinimumRole(null, "Visitor")).toBe(false);
  });

  test("gibt false zurück wenn roleId fehlt", () => {
    const session = { user: {}, expires: "9999-12-31" } as Session;
    expect(hasMinimumRole(session, "Visitor")).toBe(false);
  });

  test("gibt false für den Mayor zurück (read-only Spezialrolle)", () => {
    expect(hasMinimumRole(makeSession(0, "Mayor"), "Visitor")).toBe(false);
    expect(hasMinimumRole(makeSession(0, "Mayor"), "Member")).toBe(false);
    expect(hasMinimumRole(makeSession(0, "Mayor"), "Employee")).toBe(false);
    expect(hasMinimumRole(makeSession(0, "Mayor"), "Director")).toBe(false);
    expect(hasMinimumRole(makeSession(0, "Mayor"), "Admin")).toBe(false);
  });

  test("Admin (roleId 1) hat Zugriff auf alle Rollen", () => {
    const session = makeSession(1, "Admin");
    expect(hasMinimumRole(session, "Admin")).toBe(true);
    expect(hasMinimumRole(session, "Director")).toBe(true);
    expect(hasMinimumRole(session, "Employee")).toBe(true);
    expect(hasMinimumRole(session, "Member")).toBe(true);
    expect(hasMinimumRole(session, "Visitor")).toBe(true);
  });

  test("Director (roleId 2) hat Zugriff ab Director abwärts", () => {
    const session = makeSession(2, "Director");
    expect(hasMinimumRole(session, "Admin")).toBe(false);
    expect(hasMinimumRole(session, "Director")).toBe(true);
    expect(hasMinimumRole(session, "Employee")).toBe(true);
    expect(hasMinimumRole(session, "Member")).toBe(true);
    expect(hasMinimumRole(session, "Visitor")).toBe(true);
  });

  test("Employee (roleId 3) hat Zugriff ab Employee abwärts", () => {
    const session = makeSession(3, "Employee");
    expect(hasMinimumRole(session, "Admin")).toBe(false);
    expect(hasMinimumRole(session, "Director")).toBe(false);
    expect(hasMinimumRole(session, "Employee")).toBe(true);
    expect(hasMinimumRole(session, "Member")).toBe(true);
    expect(hasMinimumRole(session, "Visitor")).toBe(true);
  });

  test("Member (roleId 4) hat Zugriff ab Member abwärts", () => {
    const session = makeSession(4, "Member");
    expect(hasMinimumRole(session, "Admin")).toBe(false);
    expect(hasMinimumRole(session, "Director")).toBe(false);
    expect(hasMinimumRole(session, "Employee")).toBe(false);
    expect(hasMinimumRole(session, "Member")).toBe(true);
    expect(hasMinimumRole(session, "Visitor")).toBe(true);
  });

  test("Visitor (roleId 5) hat nur Zugriff auf Visitor", () => {
    const session = makeSession(5, "Visitor");
    expect(hasMinimumRole(session, "Admin")).toBe(false);
    expect(hasMinimumRole(session, "Director")).toBe(false);
    expect(hasMinimumRole(session, "Employee")).toBe(false);
    expect(hasMinimumRole(session, "Member")).toBe(false);
    expect(hasMinimumRole(session, "Visitor")).toBe(true);
  });
});

describe("isMayor", () => {
  test("gibt false zurück wenn keine Session vorhanden ist", () => {
    expect(isMayor(null)).toBe(false);
  });

  test("erkennt Mayor anhand der roleId 0", () => {
    expect(isMayor(makeSession(0, "SomeRole"))).toBe(true);
  });

  test("erkennt Mayor anhand des role-Strings", () => {
    expect(isMayor(makeSession(99, "Mayor"))).toBe(true);
  });

  test("gibt false für alle anderen Rollen zurück", () => {
    expect(isMayor(makeSession(1, "Admin"))).toBe(false);
    expect(isMayor(makeSession(2, "Director"))).toBe(false);
    expect(isMayor(makeSession(3, "Employee"))).toBe(false);
    expect(isMayor(makeSession(4, "Member"))).toBe(false);
    expect(isMayor(makeSession(5, "Visitor"))).toBe(false);
  });
});
