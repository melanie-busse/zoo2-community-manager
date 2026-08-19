import styled from "styled-components";

export const FullPageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.ui.pageBg};
`;

export const HeroSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url("/images/Zoo2_AnimalPark.jpg");
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0.4) 100%
    );
    z-index: 1;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
  margin: 0 auto;
  padding: 0 40px;

  h1 {
    font-size: clamp(2.2rem, 6vw, 4rem);
    color: ${({ theme }) => theme.colors.primary["900"]};
    margin-bottom: 30px;
    text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
    span {
      color: ${({ theme }) => theme.colors.primary["900"]};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 20px; /* Weniger Padding auf Mobile */
  }
`;

export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  width: 100%;
  margin-top: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

interface MenuCardProps {
  $color?: string;
}

export const MenuCard = styled.a<MenuCardProps>`
  display: block;
  padding: 30px;
  border-radius: ${({ theme }) => theme.borderRadius || "20px"};
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  height: 100%;

  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border: ${({ theme }) => theme.glass.border || "1px solid rgba(120, 255, 120, 0.15)"};

  transition: all 0.3s ease;
  will-change: transform, border-color, box-shadow; /* Performance Boost */

  &:hover {
    border-color: ${(props) => props.$color || props.theme.colors.primary["900"]};

    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    /* NEU: Leichte Verringerung der Unschärfe auf Hover für Feedback */
    backdrop-filter: blur(8px);
  }

  h3 {
    margin: 15px 0 10px;
    color: #333;
    font-size: 1.25rem;
    font-weight: 800;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
    color: #777;
    line-height: 1.4;
    font-weight: 500;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 20px;
    h3 {
      font-size: 1.15rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

export const Icon = styled.div`
  font-size: 2.5rem;
`;
