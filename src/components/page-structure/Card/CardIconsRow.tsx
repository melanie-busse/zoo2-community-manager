import styled from "styled-components";

export function CardIconsRow({ children }: { children: React.ReactNode }) {
  return <IconsRow>{children}</IconsRow>;
}

export const IconsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
