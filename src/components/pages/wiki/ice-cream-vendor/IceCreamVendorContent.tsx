"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  dealsTitle: string;
  dealsBody: string;
  obtainingTitle: string;
  obtainingBody: string;
  colAnimal: string;
  colShopTab: string;
  colChest: string;
  colOther: string;
  npcTitle: string;
  npcBody: string;
}

// [animal, shopTab, chest, otherSource]
const ICV_ANIMALS: [string, string, string, string][] = [
  ["Alpaca", "America", "", ""],
  ["Arctic Fox", "Arctic", "", ""],
  ["Arctic Hare", "Arctic", "", ""],
  ["Arctic Wolf", "Arctic", "", ""],
  ["Bald Eagle", "America", "", ""],
  ["Bison", "America", "", ""],
  ["Black Bear", "America", "", ""],
  ["Black Leopard", "", "Epic Chest", ""],
  ["Black Rhinoceros", "Africa", "", ""],
  ["Bongo", "Africa", "", ""],
  ["Brown Bear", "Europe", "", ""],
  ["California Sea Lion", "America", "", ""],
  ["Capybara", "America", "", ""],
  ["Cheetah", "Africa", "", ""],
  ["Clouded Leopard", "Asia", "", ""],
  ["Coati", "", "", "Club Shop (Rank 5)"],
  ["Coyote", "America", "", ""],
  ["Crested Porcupine", "Africa", "", ""],
  ["Dingo", "Australia", "", ""],
  ["Dromedary", "Africa", "", ""],
  ["Elk", "America", "", ""],
  ["Emperor Penguin", "Arctic", "", ""],
  ["Fennec Fox", "Africa", "", ""],
  ["Flamingo", "Africa", "", ""],
  ["Fossa", "Africa", "", ""],
  ["Gaur", "Asia", "", ""],
  ["Giant Anteater", "America", "", ""],
  ["Giant Panda", "Asia", "", ""],
  ["Giraffe", "Africa", "", ""],
  ["Golden Pheasant", "Asia", "", ""],
  ["Gorilla", "Africa", "", ""],
  ["Grant's Zebra", "Africa", "", ""],
  ["Greater Flamingo", "Africa", "", ""],
  ["Grey Wolf", "Europe", "", ""],
  ["Grizzly Bear", "America", "", ""],
  ["Hippopotamus", "Africa", "", ""],
  ["Impala", "Africa", "", ""],
  ["Indian Elephant", "Asia", "", ""],
  ["Indian Giant Squirrel", "", "", "Club Shop (Rank 7)"],
  ["Indian Rhino", "Asia", "", ""],
  ["Jaguar", "America", "", ""],
  ["Japanese Macaque", "Asia", "", ""],
  ["Kangaroo", "Australia", "", ""],
  ["King Cobra", "Asia", "", ""],
  ["Koala", "Australia", "", ""],
  ["Komodo Dragon", "Asia", "", ""],
  ["Kookaburra", "Australia", "", ""],
  ["Lemur", "Africa", "", ""],
  ["Leopard", "Africa", "", ""],
  ["Lion", "Africa", "", ""],
  ["Llama", "", "", "Club Shop (Rank 15)"],
  ["Lynx", "Europe", "", ""],
  ["Malayan Tapir", "Asia", "", ""],
  ["Mandrill", "Africa", "", ""],
  ["Meerkat", "Africa", "", ""],
  ["Moose", "America", "", ""],
  ["Mountain Gorilla", "Africa", "", ""],
  ["Musk Ox", "Arctic", "", ""],
  ["Nilgai", "Asia", "", ""],
  ["Okapi", "Africa", "", ""],
  ["Orang-Utan", "Asia", "", ""],
  ["Ostrich", "Africa", "", ""],
  ["Panther", "America", "", ""],
  ["Patas Monkey", "Africa", "", ""],
  ["Peacock", "Asia", "", ""],
  ["Polar Bear", "Arctic", "", ""],
  ["Puma", "America", "", ""],
  ["Red Fox", "Europe", "", ""],
  ["Red Panda", "Asia", "", ""],
  ["Reindeer", "Arctic", "", ""],
  ["Ribbon Seal", "", "", "Club Shop (Rank 12)"],
  ["Ring-Tailed Lemur", "Africa", "", ""],
  ["Rocky Mountain Goat", "America", "", ""],
  ["Siberian Tiger", "Asia", "", ""],
  ["Snow Leopard", "Asia", "", ""],
  ["Spot-Bellied Eagle-Owl", "", "", "Club Shop (Rank 9)"],
  ["Squirrel Monkey", "", "", "Club Shop (Rank 18)"],
  ["Striped Hyena", "Africa", "", ""],
  ["Sun Bear", "Asia", "", ""],
  ["Tasmanian Devil", "Australia", "", ""],
  ["Thomson's Gazelle", "Africa", "", ""],
  ["Tiger", "Asia", "", ""],
  ["Walrus", "Arctic", "", ""],
  ["Warthog", "Africa", "", ""],
  ["White Rhinoceros", "Africa", "", ""],
  ["White Stork", "", "", "Club Shop (Rank 5)"],
  ["White-Faced Owl", "", "", "Club Shop (Rank 9)"],
  ["White-Handed Gibbon", "Asia", "", ""],
  ["Wild Boar", "Europe", "", ""],
  ["Wolverine", "Arctic", "", ""],
  ["Wombat", "Australia", "", ""],
  ["Zebra", "Africa", "", ""],
];

export default function IceCreamVendorContent({
  intro,
  howItWorksTitle,
  howItWorksBody,
  dealsTitle,
  dealsBody,
  obtainingTitle,
  obtainingBody,
  colAnimal,
  colShopTab,
  colChest,
  colOther,
  npcTitle,
  npcBody,
}: Props) {
  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{howItWorksTitle}</SectionTitle>
        <p>{howItWorksBody}</p>
      </Section>

      <Section>
        <SectionTitle>{dealsTitle}</SectionTitle>
        <p>{dealsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{obtainingTitle}</SectionTitle>
        <p>{obtainingBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{colAnimal}</th>
                <th>{colShopTab}</th>
                <th>{colChest}</th>
                <th>{colOther}</th>
              </tr>
            </thead>
            <tbody>
              {ICV_ANIMALS.map(([animal, shopTab, chest, other], i) => (
                <tr key={i}>
                  <td>{animal}</td>
                  <td>{shopTab}</td>
                  <td>{chest}</td>
                  <td>{other}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{npcTitle}</SectionTitle>
        <p>{npcBody}</p>
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
