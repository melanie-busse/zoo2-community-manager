import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiAcademyContent from "@/components/pages/wiki/academy/WikiAcademyContent";

export default async function WikiAcademyPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiAcademyContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
