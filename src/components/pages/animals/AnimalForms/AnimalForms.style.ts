import styled from "styled-components";

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #5d7a2a;
  margin-left: 2px;
`;

export const SectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
  width: 100%;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  & > *:first-child {
    flex: 2;
    min-width: 100px;
  }
  & > *:last-child {
    flex: 1;
    max-width: 180px;
    min-width: 130px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px 0;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 30px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FooterSection = styled.div`
  margin-top: 30px;
  padding: 20px 0;
  border-top: 1px solid #e0ecd0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f4e8;
  &:last-child {
    border-bottom: none;
  }
`;

export const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding-left: 30px;
`;
