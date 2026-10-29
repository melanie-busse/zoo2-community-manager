import styled from "styled-components";

export function WikiBadge({ rarity }: { rarity: "rare" | "epic" | "legendary" }) {
  return <Badge rarity={rarity}>{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</Badge>;
}

const Badge = styled.span<{ rarity: "rare" | "epic" | "legendary" }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.ui.white};
  background-color: ${({ rarity, theme }) =>
    rarity === "rare"
      ? theme.colors.rarity.rare
      : rarity === "epic"
        ? theme.colors.rarity.epic
        : theme.colors.rarity.legendary};
`;
