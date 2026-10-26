"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  unlockingTitle: string;
  unlockingBody: string;
  storylineTitle: string;
  storylineBody: string;
  bonusesTitle: string;
  bonusesBody: string;
  enclosureTitle: string;
  enclosureBody: string;
  rocksTitle: string;
  rocksBody: string;
  rocksColType: string;
  rocksColLayers: string;
  rocksColCost: string;
  rocksColTime: string;
  buildingsTitle: string;
  buildingsBody: string;
  buildingsColBuilding: string;
  buildingsColCost: string;
  boothTitle: string;
  boothBody: string;
  boothColLevel: string;
  boothColCapacity: string;
  breedingTitle: string;
  breedingBody: string;
  breedingColSlot: string;
  breedingColCost: string;
}

// [type, layers, coinCostPerLayer, timePerLayer]
const TERRAIN_DEBRIS: [string, number, string, string][] = [
  ["Small Undergrowth", 1, "100", "1 min"],
  ["Medium Undergrowth", 2, "500", "2 min"],
  ["Large Undergrowth", 3, "1,000", "3 min"],
  ["Dense Thicket", 4, "2,500", "5 min"],
  ["Ancient Tree Stump", 5, "5,000", "6 min"],
];

// [building, cost]
const BUILDINGS: [string, string][] = [
  ["Admin Building", "25,000 coins"],
  ["Visitor Center", "20 ◆"],
  ["Guest Lounge", "65,000 coins"],
  ["Breeding Center", "65 ◆"],
];

// [boothLevel, coinCapacity]
const BOOTH_UPGRADES: [number, string][] = [
  [0, "2,000"],
  [1, "2,500"],
  [2, "3,000"],
  [3, "3,500"],
  [4, "4,000"],
  [5, "4,500"],
  [6, "5,000"],
  [7, "5,500"],
  [8, "6,000"],
  [9, "6,500"],
  [10, "7,000"],
];

// [slot number, cost to unlock]
const BREEDING_SLOTS: [number, string][] = [
  [1, "Unlocked by default"],
  [2, "5 ◆"],
  [3, "10 ◆"],
  [4, "15 ◆"],
  [5, "20 ◆"],
  [6, "25 ◆"],
  [7, "30 ◆"],
  [8, "35 ◆"],
  [9, "40 ◆"],
  [10, "45 ◆"],
  [11, "50 ◆"],
  [12, "55 ◆"],
];

export default function RainforestParkContent({
  intro,
  unlockingTitle,
  unlockingBody,
  storylineTitle,
  storylineBody,
  bonusesTitle,
  bonusesBody,
  enclosureTitle,
  enclosureBody,
  rocksTitle,
  rocksBody,
  rocksColType,
  rocksColLayers,
  rocksColCost,
  rocksColTime,
  buildingsTitle,
  buildingsBody,
  buildingsColBuilding,
  buildingsColCost,
  boothTitle,
  boothBody,
  boothColLevel,
  boothColCapacity,
  breedingTitle,
  breedingBody,
  breedingColSlot,
  breedingColCost,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{unlockingTitle}</SectionTitle>
        <p>{unlockingBody}</p>
      </Section>

      <Section>
        <SectionTitle>{storylineTitle}</SectionTitle>
        <p>{storylineBody}</p>
      </Section>

      <Section>
        <SectionTitle>{bonusesTitle}</SectionTitle>
        <p>{bonusesBody}</p>
      </Section>

      <Section>
        <SectionTitle>{enclosureTitle}</SectionTitle>
        <p>{enclosureBody}</p>
      </Section>

      <Section>
        <SectionTitle>{rocksTitle}</SectionTitle>
        <p>{rocksBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{rocksColType}</th>
                <th>{rocksColLayers}</th>
                <th>{rocksColCost}</th>
                <th>{rocksColTime}</th>
              </tr>
            </thead>
            <tbody>
              {TERRAIN_DEBRIS.map(([type, layers, cost, time], i) => (
                <tr key={i}>
                  <td>{type}</td>
                  <td>{layers}</td>
                  <td>{cost}</td>
                  <td>{time}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{buildingsTitle}</SectionTitle>
        <p>{buildingsBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{buildingsColBuilding}</th>
                <th>{buildingsColCost}</th>
              </tr>
            </thead>
            <tbody>
              {BUILDINGS.map(([building, cost], i) => (
                <tr key={i}>
                  <td>{building}</td>
                  <td>{cost}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{boothTitle}</SectionTitle>
        <p>{boothBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{boothColLevel}</th>
                <th>{boothColCapacity}</th>
              </tr>
            </thead>
            <tbody>
              {BOOTH_UPGRADES.map(([level, capacity]) => (
                <tr key={level}>
                  <td>{level}</td>
                  <td>{capacity}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{breedingTitle}</SectionTitle>
        <p>{breedingBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{breedingColSlot}</th>
                <th>{breedingColCost}</th>
              </tr>
            </thead>
            <tbody>
              {BREEDING_SLOTS.map(([slot, cost]) => (
                <tr key={slot}>
                  <td>{slot}</td>
                  <td>{cost}</td>
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

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
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
