import styled from "styled-components";
import { Name } from "@/components/elements/Name/Name";

export const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.grey[600]};
  padding: 4px 0;
`;

export const Divider = styled.span`
  height: 14px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.2rem;
  user-select: none;
`;

export const StatueRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
`;

export const ColorVariantWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  > div {
    max-width: 220px;
  }
`;

export const AnimalCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.ui.white};
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.white[100]};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;

  span {
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.2;
    white-space: normal;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    overflow-wrap: anywhere;

    hyphens: auto;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;

    word-break: normal;

    flex: 1;
    min-width: 0;
  }
`;

export const SubText = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.grey[100]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.ui.border};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white[200]};
  padding-bottom: 8px;
`;

export const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grey[600]};
  svg {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const AnimalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 5px 0;
`;

export const AnimalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${({ theme }) => theme.colors.white[300]};
  padding: 6px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.white[400]};
`;

export const TinyName = styled(Name)`
  font-size: 0.7rem;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.grey[700]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const DesktopOnly = styled.div`
  display: block;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: block;
  }
`;

export const ThPeriod = styled.th`
  width: 110px;
  text-align: center;
`;

export const ThStatus = styled.th`
  width: 100px;
  text-align: center;
`;

export const ThColorVariant = styled.th`
  text-align: right;
  padding-right: 20px;
`;

export const TdColorVariant = styled.td`
  padding-right: 20px;
`;
