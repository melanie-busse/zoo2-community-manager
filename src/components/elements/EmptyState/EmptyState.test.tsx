import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

import EmptyState from "./EmptyState";

vi.mock("@/components/elements/EmptyState/EmptyState.styles", () => ({
  OuterContainer: ({ children }: any) => <div>{children}</div>,
  Container: ({ children }: any) => <div>{children}</div>,
  SpeechBubble: ({ children }: any) => <div>{children}</div>,
  UppyPortraitFrame: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("next/image", () => ({
  default: ({ alt }: any) => <img alt={alt} />,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("EmptyState", () => {
  test("rendert Fallback-Texte, wenn keine Props übergeben werden", () => {
    render(<EmptyState object="animal" />);

    expect(screen.getByText("emptyState.title")).toBeInTheDocument();
    expect(screen.getByText("emptyState.message")).toBeInTheDocument();
  });

});
