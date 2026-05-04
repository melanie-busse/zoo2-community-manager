import styled from "styled-components";

export default function ActionsHeadline({ text }: { text: string }) {
  return <ActionText>{text}</ActionText>;
}

const ActionText = styled.th`
  width: 100px;
  text-align: right;
`;
