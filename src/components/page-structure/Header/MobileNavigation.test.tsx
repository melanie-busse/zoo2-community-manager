import { describe, test, expect, vi } from "vitest";

import { render, screen, fireEvent } from "@/utils/test-utils";
import MobileNavigation from "./MobileNavigation";

vi.mock("../../ui/badges/RoleBadge", () => ({ default: ({ role }: any) => <div>{role}</div> }));

const SESSION_MAYOR    = { user: { name: "Mayor",    roleId: 0, role: "Mayor"    } };
const SESSION_DIRECTOR = { user: { name: "Director", roleId: 2, role: "Director" } };
const SESSION_EMPLOYEE = { user: { name: "Employee", roleId: 3, role: "Employee" } };
const SESSION_MEMBER   = { user: { name: "Member",   roleId: 4, role: "Member"   } };
const SESSION_VISITOR  = { user: { name: "Visitor",  roleId: 5, role: "Visitor"  } };

describe("MobileNavigation", () => {
  const mockOnClose = vi.fn();

  test("rendert das mobile Menü im geöffneten Zustand", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText(/Tiere/i)).toBeInTheDocument();
  });

  test("klappt Untermenü bei Klick auf", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />);

    const menuHeader = screen.getByText(/Tiere/i);
    fireEvent.click(menuHeader);

    expect(screen.getByText(/Tierübersicht/i)).toBeVisible();
  });

  test("ruft onClose beim Klick auf einen Link auf", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />);

    const homeLink = screen.getByText(/Home/i);
    fireEvent.click(homeLink);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe("MobileNavigation – Rollenbasierte Sichtbarkeit", () => {
  const mockOnClose = vi.fn();

  test("Visitor: 'Tier anlegen' und 'Farbvariante anlegen' nicht sichtbar", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />, { session: SESSION_VISITOR });
    expect(screen.queryByText(/Tier anlegen/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Farbvariante anlegen/i)).not.toBeInTheDocument();
  });

  test("Employee: 'Tier anlegen' nicht sichtbar, 'Wettbewerb anlegen' sichtbar", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />, { session: SESSION_EMPLOYEE });
    expect(screen.queryByText(/Tier anlegen/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Wettbewerb anlegen/i)).toBeInTheDocument();
  });

  test("Member: 'Wettbewerb anlegen' nicht sichtbar", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />, { session: SESSION_MEMBER });
    expect(screen.queryByText(/Wettbewerb anlegen/i)).not.toBeInTheDocument();
  });

  test("Director: alle Create-Links sichtbar", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />, { session: SESSION_DIRECTOR });
    expect(screen.getByText(/Tier anlegen/i)).toBeInTheDocument();
    expect(screen.getByText(/Farbvariante anlegen/i)).toBeInTheDocument();
    expect(screen.getByText(/Wettbewerb anlegen/i)).toBeInTheDocument();
  });

  test("Mayor: alle Create-Links und Admin-Menü sichtbar", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />, { session: SESSION_MAYOR });
    expect(screen.getByText(/Tier anlegen/i)).toBeInTheDocument();
    expect(screen.getByText(/Farbvariante anlegen/i)).toBeInTheDocument();
    expect(screen.getByText(/Wettbewerb anlegen/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });

  test("nicht eingeloggt: kein Admin-Menü", () => {
    render(<MobileNavigation isOpen={true} onClose={mockOnClose} />, { session: null });
    expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
  });
});
