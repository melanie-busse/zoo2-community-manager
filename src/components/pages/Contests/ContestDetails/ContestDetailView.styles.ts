import styled from "styled-components";

export const RelativeWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const AdminActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing(1)};
  right: ${({ theme }) => theme.spacing(1)};
`;

export const MetaInfo = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.ui.textMain};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing(3)};
  padding: 0 ${({ theme }) => theme.spacing(1)};
  box-sizing: border-box;
`;

export const AnimalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};
`;

export const AnimalCard = styled.div`
  background: ${({ theme }) => theme.colors.ui.white};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  border: 1px solid ${({ theme }) => theme.colors.ui.border};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.boxShadow};
`;

export const AnimalHeader = styled.div`
  background: ${({ theme }) => theme.colors.ui.whiteSoft};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary["100"]};
`;

export const TitleGroup = styled.div`
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

export const GrandTotal = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary["500"]};
`;

export const List = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.ui.borderMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 5px 3px 5px;
  margin-bottom: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui.borderLight};

  span:nth-child(1) {
    width: 30px;
    text-align: center;
  }
  span:nth-child(2) {
    flex: 1;
    text-align: left;
  }
  span:nth-child(3) {
    text-align: right;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui.borderLight};

  &:last-child {
    border: none;
  }
`;

export const Name = styled.span`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  padding-left: 5px;
`;

export const Points = styled.div`
  text-align: right;

  small {
    display: block;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.ui.borderMuted};
    line-height: 1;
  }

  strong {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

export const Empty = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.ui.borderMuted};
  padding: ${({ theme }) => theme.spacing(2.5)};
  font-style: italic;
`;
