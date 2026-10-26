import { redirect } from "next/navigation";

export default async function VisitorFaqRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/faq/visitor`);
}
