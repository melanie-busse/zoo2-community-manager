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
  permanentRedirect: vi.fn(), // <--- DAS HAT GEFEHLT!
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

describe("Navigation", () => {
  test("zeigt den Link 'Tier anlegen' an, wenn eingeloggt", () => {
    // 1. Wir rendern mit Session
    render(<Navigation />, {
      session: { user: { name: "Test" }, status: "authenticated" },
    });

    const link = screen.getByTestId("nav-sub-animals-animal_create");

    expect(link).toBeInTheDocument();
  });
});
