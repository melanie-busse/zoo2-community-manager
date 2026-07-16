import styled from "styled-components";

export const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center; /* Zentriert die Filter-Optionen */

  background-color: #f3f9f4; /* Zartes, helles Natur-Grün für den Hintergrund */
  border: 2px solid #065f46; /* Dunkelgrüner, klarer Rahmen */
  border-radius: 20px; /* Schön weich abgerundete Ecken */
  padding: 12px 24px;

  width: 100%;
  max-width: 1100px;
  margin: 0 auto 30px auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    border-radius: 16px;
  }
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  background-color: ${(props) => (props.$active ? "#0e7a4a" : "#ffffff")};
  color: ${(props) => (props.$active ? "#ffffff" : "#2d3748")}; /* Dunkles Grau/Grün für gute Lesbarkeit */

  border: 1px solid ${(props) => (props.$active ? "#0e7a4a" : "#e2e8f0")};
  border-radius: 12px;

  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-family: inherit;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px; /* Gibt den Buttons eine einheitliche Struktur */

  &:hover {
    background-color: ${(props) => (props.$active ? "#1a4332" : "#f8fafc")};
    border-color: ${(props) => (props.$active ? "#1a4332" : "#cbd5e1")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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
  //background: ${({ $success }) => ($success ? "#137333" : "#0070f3")};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  &:hover {
    //background: ${({ $success }) => ($success ? "#0f5d29" : "#0051a2")};
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const UpdateButton = styled.button`
  background: #e37400;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  &:hover {
    background: #b85c00;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const StatusBadge2 = styled.span<{ $status: "imported" | "missing" | "updated" }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === "imported" ? "#e6f4ea" : $status === "updated" ? "#fef3c7" : "#fce8e6"};
  color: ${({ $status }) =>
    $status === "imported" ? "#137333" : $status === "updated" ? "#92400e" : "#c5221f"};
`;
