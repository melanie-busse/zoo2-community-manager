import styled from "styled-components";

export default function WikiInfoCard({ label, value }: { label: string; value: any }) {
  return (
    <InfoCard>
      <InfoLabel>{label}</InfoLabel>
      <InfoValue>{value}</InfoValue>
    </InfoCard>
  );
}

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.background.infocard};
  border: ${({ theme }) => theme.border.infocard};
  border-radius: ${({ theme }) => theme.borderRadius.icon};
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary[600] || "#2d5a27"};
`;

const InfoValue = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
`;
