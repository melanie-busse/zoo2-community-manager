import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const RefreshButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #555;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div<{ $color: string }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  border-left: 5px solid ${({ $color }) => $color};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-top: 4px;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#0070f3" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  border: 1px solid ${({ $active }) => ($active ? "#0070f3" : "#ccc")};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    border-color: #0070f3;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
`;

export const Th = styled.th`
  background: #f5f5f7;
  color: #333;
  text-align: left;
  padding: 14px 16px;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
`;

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #444;
  vertical-align: middle;
`;

export const StatusBadge = styled.span<{ $status: "imported" | "missing" }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $status }) => ($status === "imported" ? "#e6f4ea" : "#fce8e6")};
  color: ${({ $status }) => ($status === "imported" ? "#137333" : "#c5221f")};
`;

export const ActionButton = styled.button<{ $success?: boolean }>`
  background: ${({ $success }) => ($success ? "#137333" : "#0070f3")};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  &:hover {
    background: ${({ $success }) => ($success ? "#0f5d29" : "#0051a2")};
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
