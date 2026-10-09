import styled from "styled-components";

export default function CardDivider() {
  return <Divider />;
}

export const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin-top: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;
