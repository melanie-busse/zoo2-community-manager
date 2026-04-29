import styled from "styled-components";

export default function ActionsHeadline({ text }: { text: string }) {
  return <ActionText>{text}</ActionText>;
}

const ActionText = styled.th`
  text-align: center;
`;
