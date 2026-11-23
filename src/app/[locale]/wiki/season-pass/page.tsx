import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import SeasonPassContent from "@/components/pages/wiki/season-pass/SeasonPassContent";

export default async function SeasonPassPage() {

  return (
    <PageWrapper>
      <ContentWrapper>
        <SeasonPassContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
