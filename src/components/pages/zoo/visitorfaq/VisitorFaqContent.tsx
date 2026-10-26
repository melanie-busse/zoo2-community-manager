"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  modifiersTitle: string;
  modifiersIntro: string;
  animalsTitle: string;
  animalsBody: string;
  decorationsTitle: string;
  decorationsIntro: string;
  plantsTitle: string;
  plantsBody: string;
  enclosureDecoTitle: string;
  enclosureDecoBody: string;
  objectDecoTitle: string;
  objectDecoBody: string;
  buildingsTitle: string;
  bathroomsTitle: string;
  bathroomsBody: string;
  trashTitle: string;
  trashBody: string;
  npcsTitle: string;
  npcsBody: string;
  calculatorTitle: string;
  calculatorIntro: string;
  calculatorStep1: string;
  calculatorStep2: string;
  calculatorStep3: string;
  calculatorStep4: string;
  calculatorStep5: string;
  calculatorStep6: string;
  calculatorStep7: string;
  calculatorLink: string;
  tableTitle: string;
  tableNote: string;
  colLevel: string;
  colPointsToNext: string;
  colCumulative: string;
}

const VISITOR_LEVELS: [number, number, number][] = [
  [0, 150, 0],
  [1, 50, 150],
  [2, 70, 200],
  [3, 210, 270],
  [4, 270, 480],
  [5, 110, 750],
  [6, 130, 860],
  [7, 150, 990],
  [8, 170, 1140],
  [9, 190, 1310],
  [10, 210, 1500],
  [11, 230, 1710],
  [12, 250, 1940],
  [13, 270, 2190],
  [14, 290, 2460],
  [15, 310, 2750],
  [16, 330, 3060],
  [17, 350, 3390],
  [18, 370, 3740],
  [19, 390, 4110],
  [20, 410, 4500],
  [21, 430, 4910],
  [22, 450, 5340],
  [23, 470, 5790],
  [24, 490, 6260],
  [25, 510, 6750],
  [26, 530, 7260],
  [27, 550, 7790],
  [28, 570, 8340],
  [29, 590, 8910],
  [30, 610, 9500],
  [31, 630, 10110],
  [32, 650, 10740],
  [33, 670, 11390],
  [34, 690, 12060],
  [35, 710, 12750],
  [36, 740, 13460],
  [37, 770, 14200],
  [38, 800, 14970],
  [39, 830, 15770],
  [40, 860, 16600],
  [41, 890, 17460],
  [42, 920, 18350],
  [43, 950, 19270],
  [44, 980, 20220],
  [45, 1020, 21200],
  [46, 1060, 22220],
  [47, 1100, 23280],
];

export default function VisitorFaqContent({
  intro,
  modifiersTitle,
  modifiersIntro,
  animalsTitle,
  animalsBody,
  decorationsTitle,
  decorationsIntro,
  plantsTitle,
  plantsBody,
  enclosureDecoTitle,
  enclosureDecoBody,
  objectDecoTitle,
  objectDecoBody,
  buildingsTitle,
  bathroomsTitle,
  bathroomsBody,
  trashTitle,
  trashBody,
  npcsTitle,
  npcsBody,
  calculatorTitle,
  calculatorIntro,
  calculatorStep1,
  calculatorStep2,
  calculatorStep3,
  calculatorStep4,
  calculatorStep5,
  calculatorStep6,
  calculatorStep7,
  calculatorLink,
  tableTitle,
  tableNote,
  colLevel,
  colPointsToNext,
  colCumulative,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{modifiersTitle}</SectionTitle>
        <p>{modifiersIntro}</p>

        <SubSectionTitle>{animalsTitle}</SubSectionTitle>
        <p>{animalsBody}</p>

        <SubSectionTitle>{decorationsTitle}</SubSectionTitle>
        <p>{decorationsIntro}</p>

        <SubSubSectionTitle>{plantsTitle}</SubSubSectionTitle>
        <p>{plantsBody}</p>

        <SubSubSectionTitle>{enclosureDecoTitle}</SubSubSectionTitle>
        <p>{enclosureDecoBody}</p>

        <SubSubSectionTitle>{objectDecoTitle}</SubSubSectionTitle>
        <p>{objectDecoBody}</p>

        <SubSectionTitle>{buildingsTitle}</SubSectionTitle>

        <SubSubSectionTitle>{bathroomsTitle}</SubSubSectionTitle>
        <p>{bathroomsBody}</p>

        <SubSubSectionTitle>{trashTitle}</SubSubSectionTitle>
        <p>{trashBody}</p>

        <SubSectionTitle>{npcsTitle}</SubSectionTitle>
        <p>{npcsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{calculatorTitle}</SectionTitle>
        <p>{calculatorIntro}</p>
        <StepList>
          <li>{calculatorStep1}</li>
          <li>{calculatorStep2}</li>
          <li>{calculatorStep3}</li>
          <li>{calculatorStep4}</li>
          <li>{calculatorStep5}</li>
          <li>{calculatorStep6}</li>
          <li>{calculatorStep7}</li>
        </StepList>
        <p>{calculatorLink}</p>
      </Section>

      <Section>
        <SectionTitle>{tableTitle}</SectionTitle>
        <p>{tableNote}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colLevel}</th>
                <th>{colPointsToNext}</th>
                <th>{colCumulative}</th>
              </tr>
            </thead>
            <tbody>
              {VISITOR_LEVELS.map(([level, toNext, cumul]) => (
                <tr key={level}>
                  <td>{level}</td>
                  <td>{toNext.toLocaleString()}</td>
                  <td>{cumul.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
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

const SubSubSectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui.textMain};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StepList = styled.ol`
  padding-left: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.ui.textMain};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 500px;
  font-size: 0.9rem;

  th,
  td {
    padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.ui.border};
  }

  th {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: #fff;
    font-weight: 600;
  }

  tr:nth-child(even) td {
    background: rgba(0, 0, 0, 0.03);
  }
`;
