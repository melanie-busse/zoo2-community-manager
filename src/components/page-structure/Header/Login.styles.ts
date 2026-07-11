import styled, { keyframes } from "styled-components";

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.8) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: center;
    gap: 15px;
  }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: ${({ theme }) => theme.shadows.soft};
  object-fit: cover;
`;

export const AvatarTooltip = styled.span`
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);

  background: ${({ theme }) => theme.colors.accent.main};
  color: ${({ theme }) => theme.colors.header.avatartooltip};
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.main};
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;

  box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.ui.overlayDark};
  border: 2px solid white;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
  z-index: 1000;
`;

export const UserWrapper = styled.div`
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    ${AvatarTooltip} {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

export const LogoutBadge = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background: ${({ theme }) => theme.colors.header.bg};
  color: ${({ theme }) => theme.colors.header.avatartooltip};
  border: ${({ theme }) => theme.glass.border};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.main};
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  z-index: 1001;

  box-shadow: ${({ theme }) => theme.shadows.headerButton};
  animation: ${popIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    background: ${({ theme }) => theme.colors.accent.hover};
    transform: translateY(-2px);
  }
`;

export const HeaderButton = styled.button`
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.accent.main};
  border: ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  color: ${({ theme }) => theme.colors.header.avatartooltip};
  font-weight: 800;
  text-transform: uppercase;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.accent.hover};
  }
`;

export const WelcomeText = styled.span`
  color: white;
  font-family: ${({ theme }) => theme.fonts.text};
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  text-shadow: 0 2px 4px black;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const Menu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  z-index: 9999;
  overflow: hidden;
  padding: 6px;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
    padding-left: 20px;
  }
`;
