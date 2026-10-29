import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiClubContent from "@/components/pages/wiki/club/WikiClubContent";

export default async function WikiClubPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiClubContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
