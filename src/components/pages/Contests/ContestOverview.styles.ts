import styled from "styled-components";
import { Name } from "@/components/elements/Name/Name";

export const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.1;
  color: #333;
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

export const StatueGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const AnimalCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 200px;
`;

export const NameStack = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

export const SubText = styled.span`
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.ui.border || "#eee"};
  box-shadow: ${({ theme }) => theme.shadows.soft || "0 2px 4px rgba(0,0,0,0.02)"};
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 8px;
`;

export const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
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
  background: #fdfdfd;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

export const TinyName = styled(Name)`
  font-size: 0.7rem;
  margin-top: 4px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;
