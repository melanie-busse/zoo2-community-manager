import React from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px; /* Breite des Balkens anpassen */
`;

const Track = styled.div`
  position: relative;
  flex: 1;
  height: 16px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Fill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => $percentage}%;
  height: 100%;
  border-radius: 8px;
  transition: width 0.4s ease-in-out;

  background-image: ${({ $percentage }) => {
    const stripes = `repeating-linear-gradient(45deg, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 6px, transparent 6px, transparent 12px)`;
    if ($percentage === 100) return `${stripes}, linear-gradient(90deg, #11998e, #38ef7d)`;
    if ($percentage >= 75) return `${stripes}, linear-gradient(90deg, #3a7bd5, #3a6073)`;
    if ($percentage >= 50) return `${stripes}, linear-gradient(90deg, #f857a6, #ff5858)`;
    return `${stripes}, linear-gradient(90deg, #f7b731, #ffa801)`;
  }};
`;

const ValueText = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  color: #333333;
  min-width: 65px;
  text-align: right;
`;

interface InlineStatProps {
  label: string;
  current: number;
  total: number;
  ofLabel?: string;
}

export function InlineStatProgress({ label, current, total, ofLabel = "/" }: InlineStatProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <Row>
      <span>{label}:</span>
      <ProgressContainer>
        <Track>
          <Fill $percentage={percentage} />
        </Track>
        <ValueText>
          {current} <span style={{ color: "#888", fontWeight: 400 }}>{ofLabel} {total}</span>
        </ValueText>
      </ProgressContainer>
    </Row>
  );
}
