import { redirect } from "@/i18n/routing";
import { useLocale } from "next-intl";


export default async function ContestIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = useLocale();

  // Wenn jemand nur die ID aufruft, schicken wir ihn direkt zum Editieren
  redirect({
    href: `/contests/${id}/edit`,
    locale: locale,
  });
}
