import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiContestContent from "@/components/pages/wiki/contest/WikiContestContent";

export default async function WikiContestPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiContestContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
