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
  justify-content: center; /* Zentriert die Inputs horizontal */
  align-items: center; /* Richtet Felder & Checkbox auf einer Höhe aus */
  margin-bottom: 20px; /* Optional: etwas Abstand nach unten */
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
  padding-left: 10px;
  margin-top: 30px;

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

export const checkboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 30px;
  padding: 16px 32px;

  font-family: ${({ theme }) => theme.fonts.text}, sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.ui.textMain};

  background: linear-gradient(180deg, rgba(160, 160, 160, 0.25) 0%, rgba(120, 120, 120, 0.15) 100%);
  border: none;
  border-radius: 12px;
  border-bottom: 4px solid rgba(100, 100, 100, 0.2);

  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(180deg, rgba(160, 160, 160, 0.35) 0%, rgba(120, 120, 120, 0.25) 100%);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(2px);
    border-bottom-width: 0;
    margin-bottom: 4px;
  }
`;
