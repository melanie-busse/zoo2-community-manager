import styled from "styled-components";

export const StyledHeader = styled.header`
  display: grid;
  grid-template-columns: 140px 1fr 140px;
  grid-template-rows: 80px 50px;
  column-gap: 1.5rem;

  padding: 10px 1.5rem;
  margin: 10px auto 5px auto;
  width: 100%;

  /* Nutzt das Theme vom Provider */
  max-width: ${({ theme }) => theme.layout.widthPage};
  background: ${({ theme }) => theme.colors.header.bg};
  backdrop-filter: ${({ theme }) => theme.glass.blur};
  border: ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.borderRadius.main};
  box-shadow: ${({ theme }) => theme.shadows.soft};

  position: relative;
  z-index: 2000;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 70px 1fr 60px;
    grid-template-rows: 70px;
    /* ... */
  }
`;

export const LogoWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex;
  align-items: center;
  padding-top: 7px;

  img {
    border-radius: ${({ theme }) => theme.borderRadius.main}; /* Gleicher Radius wie die Buttons */
    box-shadow: ${({ theme }) => theme.shadows.headerButton}; /* Dezenter Schatten für Tiefe */
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05); /* Kleiner Interaktions-Effekt */
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-row: 1;

    & svg,
    & img {
      width: 60px;
      height: auto;
    }
  }
`;

export const TitleSection = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MainTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.club};
  font-size: clamp(1.2rem, 5vw, 2.4rem);
  color: ${({ theme }) => theme.colors.main.title};
  margin: 0;
  line-height: 1.1;

  text-shadow:
    1px 1px 0 ${({ theme }) => theme.colors.primary["500"]},
    2px 2px 0 ${({ theme }) => theme.colors.ui.overlayDark};

  letter-spacing: 0.15em;
  white-space: nowrap; /* Verhindert Umbruch auf Desktop */

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    white-space: normal; /* Erlaubt den Umbruch auf Mobile 2 Zeilen */
    text-align: center; /* Zentriert den Text, falls er umbricht */
    letter-spacing: 0.05em;
    text-shadow: 1px 1px 0 ${({ theme }) => theme.colors.ui.overlayDark};
  }
`;

export const NavSection = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 5px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const RightSection = styled.div`
  grid-column: 3;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  /* ÄNDERUNG: Von center zu flex-end */
  justify-content: flex-end;

  padding-bottom: 2px;
  gap: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  z-index: 10000;
  background: transparent;
  margin-right: 15px;
  border: none;
  color: ${({ theme }) => theme.colors.ui.white} !important;
  cursor: pointer;

  &:hover {
    transform: rotate(90deg);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
    grid-column: 3;
    grid-row: 1;
    align-items: center;
    justify-content: center;
  }
`;
