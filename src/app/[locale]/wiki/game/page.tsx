import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiGameContent from "@/components/pages/wiki/game/WikiGameContent";

export default async function WikiGamePage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiGameContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
