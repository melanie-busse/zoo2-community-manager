"use client";

import styled from "styled-components";

interface Props {
  intro: string;
  rolesTitle: string;
  rolesBody: string;
  rolesTableAbility: string;
  rolesTablePresident: string;
  rolesTableMinister: string;
  rolesTableMember: string;
  rolesAbilityDescription: string;
  rolesAbilityManageMembers: string;
  rolesAbilityRetractInvitation: string;
  rolesAbilityAssignPresident: string;
  rolesAbilityAssignRole: string;
  rolesAbilityFundraiser: string;
  rolesAbilityContest: string;
  rolesAbilityDonateFundraiser: string;
  rolesAbilityBenefits: string;
  rolesAbilityDonateContest: string;
  rolesAbilityChat: string;
  rolesAbilityEmblem: string;
  rolesFootnote: string;
  assigningTitle: string;
  assigningBody: string;
  addingTitle: string;
  addingApplicants: string;
  addingInvitations: string;
  removingTitle: string;
  removingBody: string;
  turnoverTitle: string;
  turnoverBody: string;
  rankTitle: string;
  rankBody: string;
  rankColRank: string;
  rankColTitle: string;
  rankColPoints: string;
  rankColCumulative: string;
  shopTitle: string;
  shopBody: string;
  shopAnimalsTitle: string;
  shopColRank: string;
  shopColAnimal: string;
  shopColCost: string;
  shopColPopularity: string;
  shopColMax: string;
  clubLevelTitle: string;
  clubLevelBody: string;
  clubLevelColLevel: string;
  clubLevelColMembers: string;
  clubLevelColXp: string;
  fundraisersTitle: string;
  fundraisersBody: string;
  fundraiserTypesTitle: string;
  fundraiserTypeCapacity: string;
  fundraiserTypeStickers: string;
  fundraiserTypeEmblems: string;
  fundraiserTypeBoosters: string;
  contestsTitle: string;
  contestsBody: string;
  leavingTitle: string;
  leavingBody: string;
  leavingTipsTitle: string;
  leavingTipsBody: string;
  joiningTitle: string;
  joiningApplying: string;
  joiningInvitation: string;
  findingTitle: string;
  findingBody: string;
}

// ✓ = has the ability
type RoleAbility = { ability: string; president: boolean; minister: boolean; member: boolean };

const MEMBER_RANKS: [number, string, string, string][] = [
  [1, "Small Bunny", "500", "0"],
  [2, "Clever Fox", "1,000", "500"],
  [3, "Mischievous Monkey", "1,500", "1,500"],
  [4, "Mighty Bear", "2,500", "3,000"],
  [5, "Proud Lion", "3,000", "5,500"],
  [6, "Elegant Swan", "4,000", "8,500"],
  [7, "Bold Eagle", "6,000", "12,500"],
  [8, "Tireless Panda", "8,000", "18,500"],
  [9, "Lively Mandrill", "10,000", "26,500"],
  [10, "Rugged Reindeer", "20,000", "36,500"],
  [11, "Tough Wild Dog", "40,000", "56,500"],
  [12, "Strong Bison", "60,000", "96,500"],
  [13, "Fearless Cheetah", "80,000", "156,500"],
  [14, "Brainy Dolphin", "100,000", "236,500"],
  [15, "Determined Komodo Dragon", "110,000", "336,500"],
  [16, "Easygoing Elephant", "120,000", "446,500"],
  [17, "Heroic Emperor Penguin", "130,000", "566,500"],
  [18, "Indispensable Bengal Tiger", "140,000", "696,500"],
  [19, "Legendary White Tiger", "150,000", "836,500"],
  [20, "Mythical Maltese Tiger", "MAX", "985,500"],
];

const SHOP_ANIMALS: [number, string, string, number, number][] = [
  [5, "Coati", "105 ◆", 1050, 5],
  [5, "White Stork", "60 ◆", 600, 5],
  [7, "Indian Giant Squirrel", "100 ◆", 1000, 5],
  [9, "White-Faced Owl", "80 ◆", 800, 5],
  [9, "Spot-Bellied Eagle-Owl", "82 ◆", 820, 2],
  [12, "Ribbon Seal", "79 ◆", 790, 4],
  [15, "Llama", "78 ◆", 780, 3],
  [18, "Squirrel Monkey", "82 ◆", 820, 2],
];

const CLUB_LEVELS: [number, number, string][] = [
  [1, 5, "5,000"],
  [2, 7, "7,500"],
  [3, 8, "10,000"],
  [4, 10, "12,500"],
  [5, 13, "15,000"],
  [6, 15, "17,500"],
  [7, 16, "20,000"],
  [8, 18, "22,500"],
  [9, 18, "25,000"],
  [10, 18, "47,500"],
  [11, 18, "59,500"],
  [12, 18, "72,500"],
  [13, 18, "86,500"],
  [14, 18, "101,500"],
  [15, 18, "117,500"],
  [16, 18, "134,500"],
  [17, 18, "152,500"],
  [18, 18, "171,500"],
  [19, 18, "191,500"],
  [20, 18, "MAX"],
];

export default function ClubFaqContent({
  intro,
  rolesTitle,
  rolesBody,
  rolesTableAbility,
  rolesTablePresident,
  rolesTableMinister,
  rolesTableMember,
  rolesAbilityDescription,
  rolesAbilityManageMembers,
  rolesAbilityRetractInvitation,
  rolesAbilityAssignPresident,
  rolesAbilityAssignRole,
  rolesAbilityFundraiser,
  rolesAbilityContest,
  rolesAbilityDonateFundraiser,
  rolesAbilityBenefits,
  rolesAbilityDonateContest,
  rolesAbilityChat,
  rolesAbilityEmblem,
  rolesFootnote,
  assigningTitle,
  assigningBody,
  addingTitle,
  addingApplicants,
  addingInvitations,
  removingTitle,
  removingBody,
  turnoverTitle,
  turnoverBody,
  rankTitle,
  rankBody,
  rankColRank,
  rankColTitle,
  rankColPoints,
  rankColCumulative,
  shopTitle,
  shopBody,
  shopAnimalsTitle,
  shopColRank,
  shopColAnimal,
  shopColCost,
  shopColPopularity,
  shopColMax,
  clubLevelTitle,
  clubLevelBody,
  clubLevelColLevel,
  clubLevelColMembers,
  clubLevelColXp,
  fundraisersTitle,
  fundraisersBody,
  fundraiserTypesTitle,
  fundraiserTypeCapacity,
  fundraiserTypeStickers,
  fundraiserTypeEmblems,
  fundraiserTypeBoosters,
  contestsTitle,
  contestsBody,
  leavingTitle,
  leavingBody,
  leavingTipsTitle,
  leavingTipsBody,
  joiningTitle,
  joiningApplying,
  joiningInvitation,
  findingTitle,
  findingBody,
}: Props) {
  const roleAbilities: RoleAbility[] = [
    { ability: rolesAbilityDescription, president: true, minister: false, member: false },
    { ability: rolesAbilityManageMembers, president: true, minister: true, member: false },
    { ability: rolesAbilityRetractInvitation, president: true, minister: false, member: false },
    { ability: rolesAbilityAssignPresident, president: true, minister: false, member: false },
    { ability: rolesAbilityAssignRole, president: true, minister: true, member: false },
    { ability: rolesAbilityFundraiser, president: true, minister: true, member: false },
    { ability: rolesAbilityContest, president: true, minister: true, member: false },
    { ability: rolesAbilityDonateFundraiser, president: true, minister: true, member: true },
    { ability: rolesAbilityBenefits, president: true, minister: true, member: true },
    { ability: rolesAbilityDonateContest, president: true, minister: true, member: true },
    { ability: rolesAbilityChat, president: true, minister: true, member: true },
    { ability: rolesAbilityEmblem, president: true, minister: true, member: false },
  ];

  return (
    <>
      <IntroParagraph>{intro}</IntroParagraph>

      <Section>
        <SectionTitle>{rolesTitle}</SectionTitle>
        <p>{rolesBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{rolesTableAbility}</th>
                <th>{rolesTablePresident}</th>
                <th>{rolesTableMinister}</th>
                <th>{rolesTableMember}</th>
              </tr>
            </thead>
            <tbody>
              {roleAbilities.map((row, i) => (
                <tr key={i}>
                  <td>{row.ability}</td>
                  <td className="center">{row.president ? "✓" : ""}</td>
                  <td className="center">{row.minister ? "✓" : ""}</td>
                  <td className="center">{row.member ? "✓" : ""}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
        <Footnote>{rolesFootnote}</Footnote>
      </Section>

      <Section>
        <SectionTitle>{assigningTitle}</SectionTitle>
        <p>{assigningBody}</p>
      </Section>

      <Section>
        <SectionTitle>{addingTitle}</SectionTitle>
        <p>{addingApplicants}</p>
        <p>{addingInvitations}</p>
      </Section>

      <Section>
        <SectionTitle>{removingTitle}</SectionTitle>
        <p>{removingBody}</p>
        <SubSectionTitle>{turnoverTitle}</SubSectionTitle>
        <p>{turnoverBody}</p>
      </Section>

      <Section>
        <SectionTitle>{rankTitle}</SectionTitle>
        <p>{rankBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{rankColRank}</th>
                <th>{rankColTitle}</th>
                <th>{rankColPoints}</th>
                <th>{rankColCumulative}</th>
              </tr>
            </thead>
            <tbody>
              {MEMBER_RANKS.map(([rank, title, points, cumulative]) => (
                <tr key={rank}>
                  <td>{rank}</td>
                  <td>{title}</td>
                  <td>{points}</td>
                  <td>{cumulative}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{shopTitle}</SectionTitle>
        <p>{shopBody}</p>
        <SubSectionTitle>{shopAnimalsTitle}</SubSectionTitle>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{shopColRank}</th>
                <th>{shopColAnimal}</th>
                <th>{shopColCost}</th>
                <th>{shopColPopularity}</th>
                <th>{shopColMax}</th>
              </tr>
            </thead>
            <tbody>
              {SHOP_ANIMALS.map(([rank, animal, cost, popularity, max], i) => (
                <tr key={i}>
                  <td>{rank}</td>
                  <td>{animal}</td>
                  <td>{cost}</td>
                  <td>{popularity.toLocaleString()}</td>
                  <td>{max}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{clubLevelTitle}</SectionTitle>
        <p>{clubLevelBody}</p>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>{clubLevelColLevel}</th>
                <th>{clubLevelColMembers}</th>
                <th>{clubLevelColXp}</th>
              </tr>
            </thead>
            <tbody>
              {CLUB_LEVELS.map(([level, members, xp]) => (
                <tr key={level}>
                  <td>{level}</td>
                  <td>{members}</td>
                  <td>{xp}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      <Section>
        <SectionTitle>{fundraisersTitle}</SectionTitle>
        <p>{fundraisersBody}</p>
        <SubSectionTitle>{fundraiserTypesTitle}</SubSectionTitle>
        <BulletList>
          <li>{fundraiserTypeCapacity}</li>
          <li>{fundraiserTypeStickers}</li>
          <li>{fundraiserTypeEmblems}</li>
          <li>{fundraiserTypeBoosters}</li>
        </BulletList>
      </Section>

      <Section>
        <SectionTitle>{contestsTitle}</SectionTitle>
        <p>{contestsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{leavingTitle}</SectionTitle>
        <p>{leavingBody}</p>
        <SubSectionTitle>{leavingTipsTitle}</SubSectionTitle>
        <p>{leavingTipsBody}</p>
      </Section>

      <Section>
        <SectionTitle>{joiningTitle}</SectionTitle>
        <p>{joiningApplying}</p>
        <p>{joiningInvitation}</p>
      </Section>

      <Section>
        <SectionTitle>{findingTitle}</SectionTitle>
        <p>{findingBody}</p>
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

const Footnote = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.ui.textMain};
  font-style: italic;
  margin-top: ${({ theme }) => theme.spacing(1)};
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

  td.center {
    text-align: center;
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

const BulletList = styled.ul`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.ui.textMain};

  li {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    line-height: 1.6;
  }
`;
