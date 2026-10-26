"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  premiumTitle: string;
  premiumBody: string;
  vipTitle: string;
  vipBody: string;
  premiumHistoryTitle: string;
  premiumHistoryBody: string;
  vipHistoryTitle: string;
  vipHistoryBody: string;
  colDate: string;
  colAnimal: string;
  colNotes: string;
}

type AnimalEntry = { date: string; animal: string; notes: string };

const PREMIUM_ANIMALS: AnimalEntry[] = [
  { date: "Mar 2026", animal: "Shiba Inu (Black & Tan) NPC", notes: "New mascot NPC" },
  { date: "Mar 27, 2025", animal: "Penguin Mascot NPC", notes: "Replaced Shiba Inu NPC" },
  { date: "Mar 12, 2024", animal: "Shiba Inu NPC", notes: "Replaced Lion Mascot NPC" },
  { date: "Aug 30, 2022", animal: "Lion Mascot NPC", notes: "First purchase bonus introduced" },
  { date: "2022", animal: "Pygmy Hippopotamus", notes: "" },
  { date: "2022", animal: "Maned Wolf", notes: "" },
  { date: "2022", animal: "Binturong", notes: "" },
  { date: "2022", animal: "Snow Leopard", notes: "" },
  { date: "2021", animal: "Okapi", notes: "" },
  { date: "2021", animal: "Axolotl", notes: "" },
  { date: "2021", animal: "Gerenuk", notes: "" },
  { date: "2021", animal: "Honey Badger", notes: "" },
  { date: "2021", animal: "Proboscis Monkey", notes: "" },
  { date: "2021", animal: "Platypus", notes: "" },
  { date: "2021", animal: "Narwhal", notes: "" },
  { date: "2021", animal: "Pygmy Slow Loris", notes: "" },
  { date: "2021", animal: "Mandrill", notes: "" },
  { date: "2021", animal: "Kinkajou", notes: "" },
  { date: "2021", animal: "Saiga Antelope", notes: "" },
  { date: "2021", animal: "Sunda Clouded Leopard", notes: "" },
  { date: "2020", animal: "Zebra Duiker", notes: "" },
  { date: "2020", animal: "Pacarana", notes: "" },
  { date: "2020", animal: "Gharial", notes: "" },
  { date: "2020", animal: "Numbat", notes: "" },
  { date: "2020", animal: "Quokka", notes: "" },
  { date: "2020", animal: "Irrawaddy Dolphin", notes: "" },
  { date: "2020", animal: "Tarsier", notes: "" },
  { date: "2020", animal: "Sun Bear", notes: "" },
  { date: "2020", animal: "Red Panda", notes: "" },
  { date: "2020", animal: "Capybara", notes: "" },
  { date: "2019", animal: "Markhor", notes: "" },
  { date: "2019", animal: "Bongo", notes: "" },
  { date: "2019", animal: "Aye-Aye", notes: "" },
  { date: "2019", animal: "Blue-Tongued Skink", notes: "" },
  { date: "2019", animal: "Meerkat", notes: "" },
  { date: "2019", animal: "Moose", notes: "" },
  { date: "2018", animal: "Serval", notes: "" },
  { date: "2018", animal: "Fennec Fox", notes: "" },
];

const VIP_ANIMALS: AnimalEntry[] = [
  { date: "2026", animal: "Przewalski's Horse", notes: "" },
  { date: "2026", animal: "Giant Anteater", notes: "" },
  { date: "2025", animal: "Clouded Leopard", notes: "" },
  { date: "2025", animal: "Mandrill", notes: "" },
  { date: "2025", animal: "Tapir", notes: "" },
  { date: "2025", animal: "Dugong", notes: "" },
  { date: "2025", animal: "Wolverine", notes: "" },
  { date: "2024", animal: "Amur Leopard", notes: "" },
  { date: "2024", animal: "Walrus", notes: "" },
  { date: "2024", animal: "Pangolin", notes: "" },
  { date: "2024", animal: "Lowland Streaked Tenrec", notes: "" },
  { date: "2024", animal: "Siberian Tiger", notes: "" },
  { date: "2024", animal: "Giant Panda", notes: "" },
  { date: "2023", animal: "Spectacled Bear", notes: "" },
  { date: "2023", animal: "Babirusa", notes: "" },
  { date: "2023", animal: "Coquerel's Sifaka", notes: "" },
  { date: "2023", animal: "Snow Leopard", notes: "" },
  { date: "2023", animal: "Hippopotamus", notes: "" },
  { date: "2023", animal: "Manatee", notes: "" },
  { date: "2022", animal: "Ocelot", notes: "" },
  { date: "2022", animal: "Orca", notes: "" },
  { date: "2022", animal: "Gorilla", notes: "" },
  { date: "2022", animal: "White Rhinoceros", notes: "" },
  { date: "2022", animal: "Chimpanzee", notes: "" },
  { date: "2021", animal: "Polar Bear", notes: "" },
  { date: "2021", animal: "African Elephant", notes: "" },
  { date: "2021", animal: "Jaguar", notes: "" },
  { date: "2021", animal: "Beluga Whale", notes: "" },
  { date: "2021", animal: "Lion", notes: "" },
  { date: "2021", animal: "Tiger", notes: "" },
  { date: "2020", animal: "Giraffe", notes: "" },
  { date: "2020", animal: "Komodo Dragon", notes: "" },
  { date: "2020", animal: "Cheetah", notes: "" },
  { date: "2020", animal: "Bottlenose Dolphin", notes: "" },
  { date: "2019", animal: "Gray Wolf", notes: "" },
  { date: "2019", animal: "Gorilla", notes: "" },
  { date: "2018", animal: "Lion", notes: "" },
];

export default function VipAnimalsContent({
  intro,
  premiumTitle,
  premiumBody,
  vipTitle,
  vipBody,
  premiumHistoryTitle,
  premiumHistoryBody,
  vipHistoryTitle,
  vipHistoryBody,
  colDate,
  colAnimal,
  colNotes,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{premiumTitle}</SectionTitle>
        <p>{premiumBody}</p>
        <SubSectionTitle>{premiumHistoryTitle}</SubSectionTitle>
        <p>{premiumHistoryBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colDate}</th>
                <th>{colAnimal}</th>
                <th>{colNotes}</th>
              </tr>
            </thead>
            <tbody>
              {PREMIUM_ANIMALS.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.animal}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{vipTitle}</SectionTitle>
        <p>{vipBody}</p>
        <SubSectionTitle>{vipHistoryTitle}</SubSectionTitle>
        <p>{vipHistoryBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colDate}</th>
                <th>{colAnimal}</th>
                <th>{colNotes}</th>
              </tr>
            </thead>
            <tbody>
              {VIP_ANIMALS.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.animal}</td>
                  <td>{row.notes}</td>
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
