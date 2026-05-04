import styled from "styled-components";

export const SectionHeadline = styled.h3`
  color: ${({ theme }) => theme.colors.primary[600]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.ui.border};
  padding-bottom: 8px;
  padding-top: 20px;
  margin: 0;
`;

export const Row = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #555;
  }
  input {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    &:focus {
      outline: none;
      border-color: #5d7a2a;
    }
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  label {
    font-weight: bold;
    color: #555;
    cursor: pointer;
  }
  input {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
`;
