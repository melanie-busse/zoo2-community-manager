import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiAnimalContent from "@/components/pages/wiki/animal/WikiAnimalContent";

export default async function WikiAnimalPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiAnimalContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
