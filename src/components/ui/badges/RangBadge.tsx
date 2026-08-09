import styled from "styled-components";

type RangBadgeProps = {
  label: number;
};

export default function RangBadge({ label }: RangBadgeProps) {
  return <Badge>{label}</Badge>;
}

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.ui.whiteSoft};
  width: 22px;
  height: 22px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 5px;
  flex-shrink: 0;
`;
