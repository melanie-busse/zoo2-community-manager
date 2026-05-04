"use client";

import styled from "styled-components";

export default function SubmitButton({
  label,
  isSubmitting,
}: {
  label: string;
  isSubmitting: boolean;
}) {
  return (
    <StyledSubmitButton type="submit" disabled={isSubmitting}>
      {label}
    </StyledSubmitButton>
  );
}

const StyledSubmitButton = styled.button`
  /* Layout */
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 30px;
  padding: 16px 32px;

  /* Typografie */
  font-family: ${({ theme }) => theme.fonts.text}, sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;

  /* Styling */
  background: linear-gradient(180deg, #88a04d 0%, #5d7a2a 100%);
  border: none;
  border-radius: 12px;
  border-bottom: 4px solid #3e521c;

  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(180deg, #96b05a 0%, #688931 100%);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(2px);
    border-bottom-width: 0;
    margin-bottom: 4px;
  }

  &:disabled {
    background: #ccc;
    border-bottom-color: #999;
    cursor: not-allowed;
    transform: none;
  }

  /* Kleiner Glanz-Effekt oben */
  &::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: ${({ theme }) => theme.colors.ui.glassWhite};
    border-radius: 50%;
  }
`;
