import { redirect } from "next/navigation";

export default async function ContestFaqRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/faq/contest`);
}
