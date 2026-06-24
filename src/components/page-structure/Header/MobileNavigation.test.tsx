import { describe, test, expect, vi } from "vitest";

import { render, screen, fireEvent } from "@/utils/test-utils";
import MobileNavigation from "./MobileNavigation";

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
