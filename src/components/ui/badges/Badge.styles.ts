import styled from "styled-components";

export const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition:
    filter 0.2s,
    transform 0.1s;

  &:hover {
    filter: brightness(1.1) sepia(1) hue-rotate(-50deg) saturate(5);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }
`;
