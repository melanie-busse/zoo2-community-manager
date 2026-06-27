import styled from "styled-components";

export const SelectWrapper = styled.div`
  position: relative;
  min-width: 240px;
  font-family: ${({ theme }) => theme.fonts.text};
  z-index: 100;
`;

export const SelectHeader = styled.div<{ $isOpen: boolean }>`
  padding: 0 16px;
  height: 48px;
  border: 2px solid ${(props) => (props.$isOpen ? props.theme.colors.primary[100] : "#e0e7d5")};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.ui.white};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[100]};
  }
`;

export const SelectedValue = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Label = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const OptionsList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.ui.white};
  border: 1px solid rgba(76, 166, 76, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 999;
  max-height: 250px;
  overflow-y: auto;
  padding: 8px;
`;

export const Option = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.ui.whiteSoft};
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;

  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  padding: 20px;
  margin-bottom: 25px;

  border: 2px solid ${({ theme }) => theme.colors.primary["600"]};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
`;

export const SearchInput = styled.input`
  flex: 2;
  min-width: 250px;
  padding: 12px 16px;
  border: 2px solid rgba(224, 231, 213, 0.5);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[100]};
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const ScaledBadge = styled.div`
  transform: scale(0.7);
  margin: -10px;
`;

export const StatusDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $color }) =>
    $color === "green" ? "#4caf50" : $color === "yellow" ? "#ffeb3b" : "#f44336"};
  display: inline-block;
`;