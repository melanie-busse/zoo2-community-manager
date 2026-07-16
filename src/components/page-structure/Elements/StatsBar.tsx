import styled from "styled-components";

interface StatItemData {
  number: number;
  label: string;
}

interface StatsBarProps {
  data: StatItemData[];
}

export default function StatsBar({ data }: StatsBarProps) {
  return (
    <StyledStatsBar>
      {data.map((item, index) => (
        <StatItem key={index}>
          <div className="number">{item.number}</div>
          <div className="label">{item.label}</div>
        </StatItem>
      ))}
    </StyledStatsBar>
  );
}
export const StyledStatsBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 50px auto;
  background: ${({ theme }) => theme.colors.ui.glassWhiteRicher};

  backdrop-filter: ${({ theme }) => theme.glass.blur};
  -webkit-backdrop-filter: ${({ theme }) => theme.glass.blur};

  border: 1px solid ${({ theme }) => theme.colors.primary[700]};

  padding: 20px 40px;
  border-radius: 50px;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 20px;
    border-radius: 25px;
    max-width: 340px;
  }
`;
export const StatItem = styled.div`
  .number {
    color: ${({ theme }) => theme.colors.primary["900"]};
    font-size: 1.8rem;
    font-weight: 900;
  }
`;
