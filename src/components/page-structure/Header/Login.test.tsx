import { render, screen, fireEvent } from "@/utils/test-utils";
import { describe, test, expect, vi } from "vitest";
import Login from "./Login";
import * as nextAuth from "next-auth/react";

// 1. Nur den Hook mocken, den Rest (wie SessionProvider) intakt lassen
vi.mock("next-auth/react", async () => {
  const actual = await vi.importActual("next-auth/react");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

// 2. Deine anderen Mocks bleiben bestehen
vi.mock("./LangSwitcher", () => ({ default: () => <div data-testid="lang-switcher">Lang</div> }));
vi.mock("../../ui/badges/RoleBadge", () => ({ default: ({ role }: any) => <div>{role}</div> }));

// ... Deine Mock-Styles bleiben wie gehabt ...

describe("Login Komponente", () => {
  test("zeigt Login-Button, wenn keine Session vorhanden ist", () => {
    vi.mocked(nextAuth.useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    render(<Login />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("zeigt Avatar, wenn Session vorhanden ist", () => {
    vi.mocked(nextAuth.useSession).mockReturnValue({
      data: { user: { name: "Melanie" } },
      status: "authenticated",
    } as any);

    render(<Login />);
    expect(screen.getByAltText("Profil")).toBeInTheDocument();
  });

  test("Logout-Badge erscheint beim Klick auf den Avatar", () => {
    vi.mocked(nextAuth.useSession).mockReturnValue({
      data: { user: { name: "Melanie" } },
      status: "authenticated",
    } as any);

    render(<Login />);

    const avatar = screen.getByAltText("Profil");
    fireEvent.click(avatar);

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
