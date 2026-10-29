import PageWrapper from "@/components/page-structure/page/PageWrapper";
import ContentWrapper from "@/components/page-structure/page/ContentWrapper";
import WikiCurrencyContent from "@/components/pages/wiki/currency/WikiCurrencyContent";

export default async function WikiCurrencyPage() {
  return (
    <PageWrapper>
      <ContentWrapper>
        <WikiCurrencyContent />
      </ContentWrapper>
    </PageWrapper>
  );
}
