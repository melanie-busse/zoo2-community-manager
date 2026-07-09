import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { createSpecialCoat, getAllSpecialCoats } from "@/service/SpecialCoatsService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Wir definieren locale direkt hier oben, damit es überall (auch im catch) greift
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";

  try {
    const specialCoats = await getAllSpecialCoats(locale);

    if (!specialCoats || specialCoats.length === 0) {
      // Englisches Log für die Serverkonsole
      console.warn(`[API] No special coats found for locale '${locale}'.`);
    }

    return NextResponse.json(specialCoats);
  } catch (error) {
    const t = await getTranslations({ locale, namespace: "api" });
    console.error("[API] Error during GET (SpecialCoats):", error);
    return NextResponse.json({ error: t("errors.load_error") }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const body = await request.json();

    if (!body.animalId || !body.texts || body.texts.length === 0) {
      return NextResponse.json({ message: t("specialcoat.required_fields") }, { status: 400 });
    }

    const newCoat = await createSpecialCoat(body);

    return NextResponse.json({ id: newCoat?.id }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Error during POST (SpecialCoats):", error);
    return NextResponse.json(
      { message: t("specialcoat.create_error"), error: error.message },
      { status: 500 },
    );
  }
}
