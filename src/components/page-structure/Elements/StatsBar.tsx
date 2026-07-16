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
  background: rgba(255, 255, 255, 0.5);

  backdrop-filter: ${({ theme }) => theme.glass.blur || "blur(10px)"};
  -webkit-backdrop-filter: blur(10px);

  border: 1px solid rgba(120, 255, 120, 0.15);

  padding: 20px 40px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

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
