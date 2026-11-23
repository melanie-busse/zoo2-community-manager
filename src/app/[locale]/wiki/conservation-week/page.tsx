import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiConservationContent from "@/components/pages/wiki/conservation-week/WikiConservationWeekContent";

export default async function ConservationWeekPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiConservationContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
