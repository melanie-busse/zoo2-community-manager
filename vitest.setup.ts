import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Sedgwick_Ave_Display: () => ({
    style: { fontFamily: "Sedgwick" },
  }),
  DM_Sans: () => ({
    style: { fontFamily: "DM Sans" },
  }),
  Playfair_Display: () => ({
    style: { fontFamily: "Playfair" },
  }),
}));

vi.mock("@/i18n/routing", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/i18n/routing")>();

  return {
    ...actual,
    useRouter: vi.fn(() => ({
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      push: vi.fn(),
      replace: vi.fn(),
    })),
    usePathname: vi.fn(() => "/"),
  };
});
