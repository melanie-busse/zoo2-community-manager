import styled from "styled-components";

export const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  width: 80vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin-bottom: 12px;
`;

export const StatsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
`;

export const IconsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ActionGroup = styled.div`
  display: flex;
  gap: 16px;

  button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
  }
`;
