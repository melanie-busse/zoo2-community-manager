import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { getAllAnimals, createAnimal } from "@/service/AnimalService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Wir definieren locale und t direkt hier oben, damit sie im gesamten Scope (auch im catch) verfügbar sind
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";

  try {
    const animals = await getAllAnimals(locale);

    if (!animals || animals.length === 0) {
      // Ein englisches Log ist im Backend Standard und spart Übersetzungs-Overhead in den JSON-Dateien
      console.warn(
        `[API] No animals found for locale '${locale}' (database might be empty or offline).`,
      );
    }

    return NextResponse.json(animals);
  } catch (error) {
    const t = await getTranslations({ locale, namespace: "api" });
    console.error("[API] Error during GET:", error);
    return NextResponse.json({ error: t("errors.load_error") }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const body = await request.json();

    // Wir suchen den Namen basierend auf dem aktuellen locale, falls vorhanden, sonst fallback auf 'de'
    const currentName =
      body.animaltext?.find((t: any) => t.languageCode === locale)?.animalName ||
      body.animaltext?.find((t: any) => t.languageCode === "de")?.animalName;

    if (!currentName || !body.biomeId) {
      return NextResponse.json({ message: t("animal.required_fields") }, { status: 400 });
    }

    const newAnimal = await createAnimal(body);

    return NextResponse.json({ id: newAnimal.id }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Error during POST:", error);
    return NextResponse.json(
      { message: t("animal.create_error"), error: error.message },
      { status: 500 },
    );
  }
}
