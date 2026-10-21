"use client";

import { describe, test, expect, vi } from "vitest";

import { render, screen } from "@/utils/test-utils";
import Navigation from "./Navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/animals",
  useRouter: () => ({
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
  }),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

const SESSION_MAYOR    = { user: { name: "Mayor",    roleId: 0, role: "Mayor"    } };
const SESSION_ADMIN    = { user: { name: "Admin",    roleId: 1, role: "Admin"    } };
const SESSION_DIRECTOR = { user: { name: "Director", roleId: 2, role: "Director" } };
const SESSION_EMPLOYEE = { user: { name: "Employee", roleId: 3, role: "Employee" } };
const SESSION_MEMBER   = { user: { name: "Member",   roleId: 4, role: "Member"   } };
const SESSION_VISITOR  = { user: { name: "Visitor",  roleId: 5, role: "Visitor"  } };

describe("Navigation – 'Wettbewerb anlegen'", () => {
  test("Visitor: nicht sichtbar", () => {
    render(<Navigation />, { session: SESSION_VISITOR });
    expect(screen.queryByTestId("nav-sub-contests-club_create_contest")).not.toBeInTheDocument();
  });

  test("Member: nicht sichtbar", () => {
    render(<Navigation />, { session: SESSION_MEMBER });
    expect(screen.queryByTestId("nav-sub-contests-club_create_contest")).not.toBeInTheDocument();
  });

  test("Employee: sichtbar", () => {
    render(<Navigation />, { session: SESSION_EMPLOYEE });
    expect(screen.getByTestId("nav-sub-contests-club_create_contest")).toBeInTheDocument();
  });

  test("Director: sichtbar", () => {
    render(<Navigation />, { session: SESSION_DIRECTOR });
    expect(screen.getByTestId("nav-sub-contests-club_create_contest")).toBeInTheDocument();
  });

  test("Mayor (Demo-Account): sichtbar", () => {
    render(<Navigation />, { session: SESSION_MAYOR });
    expect(screen.getByTestId("nav-sub-contests-club_create_contest")).toBeInTheDocument();
  });
});

describe("Navigation – Tiere importieren (unter Animals)", () => {
  test("nicht eingeloggt: Import-Link nicht sichtbar", () => {
    render(<Navigation />, { session: null });
    expect(screen.queryByText(/Tiere importieren/i)).not.toBeInTheDocument();
  });

  test("Director: Import-Link sichtbar", () => {
    render(<Navigation />, { session: SESSION_DIRECTOR });
    expect(screen.getByText(/Tiere importieren/i)).toBeInTheDocument();
  });

  test("Admin: Import-Link sichtbar", () => {
    render(<Navigation />, { session: SESSION_ADMIN });
    expect(screen.getByText(/Tiere importieren/i)).toBeInTheDocument();
  });
});

describe("Navigation – 'Tier anlegen' und 'Farbvariante anlegen'", () => {
  test("nicht eingeloggt: Create-Links nicht sichtbar", () => {
    render(<Navigation />, { session: null });

    expect(screen.queryByTestId("nav-sub-animals-animal_create")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-sub-animals-specialcoats_create")).not.toBeInTheDocument();
  });

  test("Visitor: Create-Links nicht sichtbar", () => {
    render(<Navigation />, { session: SESSION_VISITOR });

    expect(screen.queryByTestId("nav-sub-animals-animal_create")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-sub-animals-specialcoats_create")).not.toBeInTheDocument();
  });

  test("Member: Create-Links nicht sichtbar", () => {
    render(<Navigation />, { session: SESSION_MEMBER });

    expect(screen.queryByTestId("nav-sub-animals-animal_create")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-sub-animals-specialcoats_create")).not.toBeInTheDocument();
  });

  test("Employee: Create-Links nicht sichtbar", () => {
    render(<Navigation />, { session: SESSION_EMPLOYEE });

    expect(screen.queryByTestId("nav-sub-animals-animal_create")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-sub-animals-specialcoats_create")).not.toBeInTheDocument();
  });

  test("Director: Create-Links sichtbar", () => {
    render(<Navigation />, { session: SESSION_DIRECTOR });

    expect(screen.getByTestId("nav-sub-animals-animal_create")).toBeInTheDocument();
    expect(screen.getByTestId("nav-sub-animals-specialcoats_create")).toBeInTheDocument();
  });

  test("Admin: Create-Links sichtbar", () => {
    render(<Navigation />, { session: SESSION_ADMIN });

    expect(screen.getByTestId("nav-sub-animals-animal_create")).toBeInTheDocument();
    expect(screen.getByTestId("nav-sub-animals-specialcoats_create")).toBeInTheDocument();
  });

  test("Mayor (Demo-Account): Create-Links sichtbar", () => {
    render(<Navigation />, { session: SESSION_MAYOR });

    expect(screen.getByTestId("nav-sub-animals-animal_create")).toBeInTheDocument();
    expect(screen.getByTestId("nav-sub-animals-specialcoats_create")).toBeInTheDocument();
  });
});
