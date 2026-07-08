import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export default async function ContestIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();

  // Wenn jemand nur die ID aufruft, schicken wir ihn direkt zum Editieren
  redirect({
    href: `/contests/${id}/edit`,
    locale: locale,
  });
}
