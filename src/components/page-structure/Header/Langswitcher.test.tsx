import { describe, test, expect, vi } from "vitest";

import { render, screen, fireEvent } from "@/utils/test-utils";
import LangSwitcher from "./LangSwitcher";

const mockReplace = vi.fn();
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/",
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock("next-intl", async () => {
  const actual = await vi.importActual("next-intl");
  return {
    ...actual,
    useLocale: () => "de",
    useTranslations: () => (key: string) => key,
  };
});

vi.mock("./LangSwitcher.styles", () => ({
  LangSwitcherContainer: ({ children }: any) => <div>{children}</div>,
  CurrentLanguage: ({ children, onClick }: any) => (
    <div onClick={onClick} data-testid="current-lang">
      {children}
    </div>
  ),
  LangDropdown: ({ children, $show }: any) =>
    $show ? <div data-testid="dropdown">{children}</div> : null,
  LangOption: ({ children, onClick, "data-testid": testId }: any) => (
    <div onClick={onClick} data-testid={testId || "lang-option"}>
      {children}
    </div>
  ),
}));

describe("LangSwitcher", () => {
  test("öffnet das Dropdown und wechselt die Sprache", () => {
    render(<LangSwitcher />);

    const currentLang = screen.getByTestId("current-lang");
    fireEvent.click(currentLang);

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();

    const options = screen.getAllByTestId("lang-option");
    fireEvent.click(options[0]);

    expect(mockReplace).toHaveBeenCalled();
  });
});
