import { getTranslations } from "next-intl/server";
import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import PageHeader from "@/components/page-structure/page/PageHeader";
import ClubFaqContent from "@/components/pages/faq/club/ClubFaqContent";

export default async function ClubFaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clubfaq" });

  return (
    <PageWrapper>
      <ContentWrapper>
        <PageHeader text={t("title")} />
        <ClubFaqContent
          intro={t("intro")}
          rolesTitle={t("roles_title")}
          rolesBody={t("roles_body")}
          rolesTableAbility={t("roles_table_ability")}
          rolesTablePresident={t("roles_table_president")}
          rolesTableMinister={t("roles_table_minister")}
          rolesTableMember={t("roles_table_member")}
          rolesAbilityDescription={t("roles_ability_description")}
          rolesAbilityManageMembers={t("roles_ability_manage_members")}
          rolesAbilityRetractInvitation={t("roles_ability_retract_invitation")}
          rolesAbilityAssignPresident={t("roles_ability_assign_president")}
          rolesAbilityAssignRole={t("roles_ability_assign_role")}
          rolesAbilityFundraiser={t("roles_ability_fundraiser")}
          rolesAbilityContest={t("roles_ability_contest")}
          rolesAbilityDonateFundraiser={t("roles_ability_donate_fundraiser")}
          rolesAbilityBenefits={t("roles_ability_benefits")}
          rolesAbilityDonateContest={t("roles_ability_donate_contest")}
          rolesAbilityChat={t("roles_ability_chat")}
          rolesAbilityEmblem={t("roles_ability_emblem")}
          rolesFootnote={t("roles_footnote")}
          assigningTitle={t("assigning_title")}
          assigningBody={t("assigning_body")}
          addingTitle={t("adding_title")}
          addingApplicants={t("adding_applicants")}
          addingInvitations={t("adding_invitations")}
          removingTitle={t("removing_title")}
          removingBody={t("removing_body")}
          turnoverTitle={t("turnover_title")}
          turnoverBody={t("turnover_body")}
          rankTitle={t("rank_title")}
          rankBody={t("rank_body")}
          rankColRank={t("rank_col_rank")}
          rankColTitle={t("rank_col_title")}
          rankColPoints={t("rank_col_points")}
          rankColCumulative={t("rank_col_cumulative")}
          shopTitle={t("shop_title")}
          shopBody={t("shop_body")}
          shopAnimalsTitle={t("shop_animals_title")}
          shopColRank={t("shop_col_rank")}
          shopColAnimal={t("shop_col_animal")}
          shopColCost={t("shop_col_cost")}
          shopColPopularity={t("shop_col_popularity")}
          shopColMax={t("shop_col_max")}
          clubLevelTitle={t("club_level_title")}
          clubLevelBody={t("club_level_body")}
          clubLevelColLevel={t("club_level_col_level")}
          clubLevelColMembers={t("club_level_col_members")}
          clubLevelColXp={t("club_level_col_xp")}
          fundraisersTitle={t("fundraisers_title")}
          fundraisersBody={t("fundraisers_body")}
          fundraiserTypesTitle={t("fundraiser_types_title")}
          fundraiserTypeCapacity={t("fundraiser_type_capacity")}
          fundraiserTypeStickers={t("fundraiser_type_stickers")}
          fundraiserTypeEmblems={t("fundraiser_type_emblems")}
          fundraiserTypeBoosters={t("fundraiser_type_boosters")}
          contestsTitle={t("contests_title")}
          contestsBody={t("contests_body")}
          leavingTitle={t("leaving_title")}
          leavingBody={t("leaving_body")}
          leavingTipsTitle={t("leaving_tips_title")}
          leavingTipsBody={t("leaving_tips_body")}
          joiningTitle={t("joining_title")}
          joiningApplying={t("joining_applying")}
          joiningInvitation={t("joining_invitation")}
          findingTitle={t("finding_title")}
          findingBody={t("finding_body")}
        />
      </ContentWrapper>
    </PageWrapper>
  );
}
