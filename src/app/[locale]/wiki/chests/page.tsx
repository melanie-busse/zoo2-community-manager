import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import ChestsFaqContent from "@/components/pages/wiki/chests/WikiChestsContent";

export default async function WikiChestsPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <ChestsFaqContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
