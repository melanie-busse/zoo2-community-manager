"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  recruitedTitle: string;
  recruitedBody: string;
  objectivesTitle: string;
  objectiveLevel: string;
  objectiveAnimals: string;
  objectiveDiamonds: string;
  objectiveAcademy: string;
  objectiveRecruit: string;
  objectivesNote: string;
  rewardsTitle: string;
  ingameTitle: string;
  ingameBody: string;
  addingTitle: string;
  addingBody: string;
  removingTitle: string;
  removingBody: string;
  zooDetailsTitle: string;
  zooDetailsBody: string;
  helpingTitle: string;
  helpingBody: string;
  minigamesTitle: string;
  minigameCrows: string;
  minigameChildren: string;
  minigameAnimals: string;
  skipTitle: string;
  skipBody: string;
  messagingTitle: string;
  messagingBody: string;
  deletingTitle: string;
  deletingBody: string;
  levelupTitle: string;
  levelupBody: string;
  chestsTitle: string;
  chestsBody: string;
  troubleshootingTitle: string;
  troubleshootingBody: string;
  fixDevice: string;
  fixFriends: string;
  fixSettings: string;
}

export default function FriendsContent({
  intro,
  recruitedTitle,
  recruitedBody,
  objectivesTitle,
  objectiveLevel,
  objectiveAnimals,
  objectiveDiamonds,
  objectiveAcademy,
  objectiveRecruit,
  objectivesNote,
  rewardsTitle,
  ingameTitle,
  ingameBody,
  addingTitle,
  addingBody,
  removingTitle,
  removingBody,
  zooDetailsTitle,
  zooDetailsBody,
  helpingTitle,
  helpingBody,
  minigamesTitle,
  minigameCrows,
  minigameChildren,
  minigameAnimals,
  skipTitle,
  skipBody,
  messagingTitle,
  messagingBody,
  deletingTitle,
  deletingBody,
  levelupTitle,
  levelupBody,
  chestsTitle,
  chestsBody,
  troubleshootingTitle,
  troubleshootingBody,
  fixDevice,
  fixFriends,
  fixSettings,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{recruitedTitle}</SectionTitle>
        <p>{recruitedBody}</p>
      </Section>

      <Section>
        <SectionTitle>{objectivesTitle}</SectionTitle>
        <BulletList>
          <li>{objectiveLevel}</li>
          <li>{objectiveAnimals}</li>
          <li>{objectiveDiamonds}</li>
          <li>{objectiveAcademy}</li>
          <li>{objectiveRecruit}</li>
        </BulletList>
        <p>{objectivesNote}</p>
      </Section>

      <Section>
        <SectionTitle>{rewardsTitle}</SectionTitle>
        <SubSectionTitle>{ingameTitle}</SubSectionTitle>
        <p>{ingameBody}</p>
      </Section>

      <Section>
        <SectionTitle>{addingTitle}</SectionTitle>
        <p>{addingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{removingTitle}</SectionTitle>
        <p>{removingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{zooDetailsTitle}</SectionTitle>
        <p>{zooDetailsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{helpingTitle}</SectionTitle>
        <p>{helpingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{minigamesTitle}</SectionTitle>
        <BulletList>
          <li>{minigameCrows}</li>
          <li>{minigameChildren}</li>
          <li>{minigameAnimals}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{skipTitle}</SectionTitle>
        <p>{skipBody}</p>
      </Section>

      <Section>
        <SectionTitle>{messagingTitle}</SectionTitle>
        <p>{messagingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{deletingTitle}</SectionTitle>
        <p>{deletingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{levelupTitle}</SectionTitle>
        <p>{levelupBody}</p>
      </Section>

      <Section>
        <SectionTitle>{chestsTitle}</SectionTitle>
        <p>{chestsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{troubleshootingTitle}</SectionTitle>
        <p>{troubleshootingBody}</p>
        <BulletList>
          <li>{fixDevice}</li>
          <li>{fixFriends}</li>
          <li>{fixSettings}</li>
        </BulletList>
      </Section>
    </>
  );
}

const IntroParagraph = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  p {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[500]};
`;

const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};
  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
