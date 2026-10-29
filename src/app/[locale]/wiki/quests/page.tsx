import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiQuestsContent from "@/components/pages/wiki/quests/WikiQuestsContent";

export default async function WikiQuestsPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiQuestsContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
