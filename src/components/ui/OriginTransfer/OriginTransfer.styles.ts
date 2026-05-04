import styled from "styled-components";

export const TransferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
interface ColumnProps {
  $highlight?: boolean;
}

export const Column = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  background: ${(props) => (props.$highlight ? "#f9fbf5" : "#fff")};
  border: 2px solid ${(props) => (props.$highlight ? "#d1e2a5" : "#eee")};
  border-radius: 12px;
  overflow: hidden;
`;

export const ColumnTitle = styled.div`
  background: #f4f7ed;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #5d7a2a;
  border-bottom: 1px solid #eee;
  text-align: center;
`;

export const List = styled.div`
  height: 200px;
  overflow-y: auto;
  padding: 5px;

  /* Custom Scrollbar für den Look */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1e2a5;
    border-radius: 10px;
  }
`;

export const EmptyNote = styled.div`
  padding: 20px;
  text-align: center;
  color: #bbb;
  font-size: 0.85rem;
  font-style: italic;
`;

export const Item = styled.div<{ $disabled?: boolean; $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 4px;
  border-radius: 8px;
  background: white;
  border: 1px solid #eef3e2;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  ${(props) =>
    props.$disabled &&
    !props.$selected &&
    `
    opacity: 0.4;
    filter: grayscale(1);
    cursor: not-allowed;
    background: #fdfdfd;
    pointer-events: none;
  `}

  &:hover {
    border-color: ${(props) => (props.$disabled && !props.$selected ? "#eef3e2" : "#88a04d")};
    background: ${(props) => (props.$disabled && !props.$selected ? "white" : "#f0f4e8")};
    transform: translateX(
      ${(props) => {
        if (props.$disabled && !props.$selected) return "0";
        return props.$selected ? "-3px" : "3px";
      }}
    );
  }

  span {
    flex: 1;
    margin: 0 8px;
  }

  svg {
    color: #88a04d;
  }
`;
