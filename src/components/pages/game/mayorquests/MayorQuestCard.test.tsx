import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@/utils/test-utils";
import MayorQuestCard from "./MayorQuestCard";
import type { MayorQuestItem } from "@/service/MayorQuestService";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock("@/components/ui/badges/GameBadge", () => ({
  default: ({ image }: { image: { path: string; alt: string } }) => <img src={image.path} alt={image.alt} />,
}));

const baseQuest: MayorQuestItem = {
  id: 1,
  sortOrder: 1,
  titleName: "Small Town Zoo",
  level: 8,
  coinReward: 5000,
  diamondReward: 0,
  ticketReward: 0,
  energyReward: 0,
  xpReward: 1500,
  questName: "Lofty Aspirations",
  dialogText: null,
  objectives: [],
  rewards: [],
};

function renderCard(quest: MayorQuestItem) {
  return render(<MayorQuestCard quest={quest} />);
}

describe("MayorQuestCard – Titel und Level", () => {
  test("zeigt Titel an", () => {
    renderCard(baseQuest);
    expect(screen.getByText("Small Town Zoo")).toBeInTheDocument();
  });

  test("zeigt Level an", () => {
    renderCard(baseQuest);
    expect(screen.getByText(/Level 8\+/)).toBeInTheDocument();
  });
});

describe("MayorQuestCard – Sprechblase", () => {
  test("Sprechblase wird nicht angezeigt wenn dialogText null", () => {
    renderCard(baseQuest);
    expect(screen.queryByAltText("Bürgermeister")).not.toBeInTheDocument();
  });

  test("Sprechblase wird angezeigt wenn dialogText gesetzt", () => {
    renderCard({ ...baseQuest, dialogText: "Herzlichen Glückwunsch!" });
    expect(screen.getByText("Herzlichen Glückwunsch!")).toBeInTheDocument();
    expect(screen.getByAltText("Bürgermeister")).toBeInTheDocument();
  });
});

describe("MayorQuestCard – Münzen-Reward", () => {
  test("Münzen werden angezeigt wenn coinReward > 0", () => {
    renderCard({ ...baseQuest, coinReward: 5000 });
    expect(screen.getByAltText("Coins")).toBeInTheDocument();
    expect(screen.getByText("5.000")).toBeInTheDocument();
  });

  test("Münzen werden nicht angezeigt wenn coinReward = 0", () => {
    renderCard({ ...baseQuest, coinReward: 0 });
    expect(screen.queryByAltText("Coins")).not.toBeInTheDocument();
  });
});

describe("MayorQuestCard – XP-Reward", () => {
  test("XP wird angezeigt wenn xpReward > 0", () => {
    renderCard({ ...baseQuest, xpReward: 1500 });
    expect(screen.getByAltText("XP")).toBeInTheDocument();
    expect(screen.getByText("1.500")).toBeInTheDocument();
  });

  test("XP wird nicht angezeigt wenn xpReward = 0", () => {
    renderCard({ ...baseQuest, xpReward: 0 });
    expect(screen.queryByAltText("XP")).not.toBeInTheDocument();
  });
});

describe("MayorQuestCard – Diamanten-Reward", () => {
  test("Diamanten werden angezeigt wenn diamondReward > 0", () => {
    renderCard({ ...baseQuest, diamondReward: 25 });
    expect(screen.getByAltText("Diamonds")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  test("Diamanten werden nicht angezeigt wenn diamondReward = 0", () => {
    renderCard({ ...baseQuest, diamondReward: 0 });
    expect(screen.queryByAltText("Diamonds")).not.toBeInTheDocument();
  });
});

describe("MayorQuestCard – Ticket-Reward", () => {
  test("Tickets werden angezeigt wenn ticketReward > 0", () => {
    renderCard({ ...baseQuest, coinReward: 0, xpReward: 0, ticketReward: 5000 });
    expect(screen.getByAltText("Tickets")).toBeInTheDocument();
    expect(screen.getByText("5.000")).toBeInTheDocument();
  });

  test("Tickets werden nicht angezeigt wenn ticketReward = 0", () => {
    renderCard({ ...baseQuest, ticketReward: 0 });
    expect(screen.queryByAltText("Tickets")).not.toBeInTheDocument();
  });
});

describe("MayorQuestCard – Energie-Reward", () => {
  test("Energie wird angezeigt wenn energyReward > 0", () => {
    renderCard({ ...baseQuest, energyReward: 50 });
    expect(screen.getByAltText("Energy")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  test("Energie wird nicht angezeigt wenn energyReward = 0", () => {
    renderCard({ ...baseQuest, energyReward: 0 });
    expect(screen.queryByAltText("Energy")).not.toBeInTheDocument();
  });
});

describe("MayorQuestCard – dynamische Rewards", () => {
  test("dynamische Reward-Items werden angezeigt", () => {
    renderCard({
      ...baseQuest,
      rewards: [
        { id: 1, sortOrder: 1, imagePath: "/images/mayorquests/rewards/horse.jpg", amount: 1 },
        { id: 2, sortOrder: 2, imagePath: "/images/mayorquests/rewards/key.png", amount: 10 },
      ],
    });
    expect(screen.getByText("1x")).toBeInTheDocument();
    expect(screen.getByText("10x")).toBeInTheDocument();
  });

  test("keine dynamischen Reward-Items wenn rewards leer", () => {
    renderCard({ ...baseQuest, rewards: [] });
    expect(screen.queryByText("1x")).not.toBeInTheDocument();
  });
});

describe("MayorQuestCard – Aufgaben", () => {
  test("Aufgaben werden angezeigt", () => {
    renderCard({
      ...baseQuest,
      objectives: [
        { id: 1, sortOrder: 1, text: "12 verschiedene Tierarten haben", imagePath: null },
        { id: 2, sortOrder: 2, text: "Zoo 5 mal erweitern", imagePath: null },
      ],
    });
    expect(screen.getByText("12 verschiedene Tierarten haben")).toBeInTheDocument();
    expect(screen.getByText("Zoo 5 mal erweitern")).toBeInTheDocument();
  });
});
