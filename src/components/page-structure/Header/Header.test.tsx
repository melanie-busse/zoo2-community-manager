import { describe, test, expect, vi } from "vitest";

import { render, screen, fireEvent } from "@/utils/test-utils";
import Header from "./Header";

vi.mock("@/components/page-structure/Header/Navigation", () => ({
  default: () => <nav>DesktopNav</nav>,
}));

vi.mock("@/components/page-structure/Header/Logo", () => ({
  default: () => <div>Logo</div>,
}));

vi.mock("@/components/page-structure/Header/MobileNavigation", () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mobile-nav">{isOpen ? "Open" : "Closed"}</div>
  ),
}));

vi.mock("@/components/page-structure/Header/Login", () => ({
  default: () => <div data-testid="login-component">Login</div>,
}));

vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({
    style: { fontFamily: "var(--font-sedgwick)", fontWeight: 400 },
  }),
  DM_Sans: () => ({
    style: { fontFamily: "var(--font-dm-sans)" },
  }),
  Playfair_Display: () => ({
    style: { fontFamily: "var(--font-playfair)" },
  }),
}));

vi.mock("./Header.styles", () => ({
  StyledHeader: ({ children }: any) => <header>{children}</header>,
  LogoWrapper: ({ children }: any) => <div>{children}</div>,
  TitleSection: ({ children }: any) => <div>{children}</div>,
  MainTitle: ({ children }: any) => <h1>{children}</h1>,
  // Hier wird der aria-label Prop korrekt weitergereicht:
  MobileMenuButton: (props: any) => (
    <button onClick={props.onClick} aria-label={props["aria-label"]}>
      {props.children}
    </button>
  ),
  NavSection: ({ children }: any) => <div>{children}</div>,
  RightSection: ({ children }: any) => <div>{children}</div>,
}));

describe("Header", () => {
  test("rendert die Grundstruktur des Headers", () => {
    render(<Header />);

    expect(screen.getByText("Logo")).toBeInTheDocument();
    expect(screen.getByText("DesktopNav")).toBeInTheDocument();
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  test("toggled das mobile Menü und ändert den Body-Overflow", () => {
    render(<Header />);

    const button = screen.getByLabelText("Toggle Menu");
    const mobileNav = screen.getByTestId("mobile-nav");

    expect(mobileNav).toHaveTextContent("Closed");
    expect(document.body.style.overflow).toBe("auto");

    fireEvent.click(button);
    expect(mobileNav).toHaveTextContent("Open");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(button);
    expect(mobileNav).toHaveTextContent("Closed");
    expect(document.body.style.overflow).toBe("auto");
  });
});
