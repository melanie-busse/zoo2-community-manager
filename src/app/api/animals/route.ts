import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { getAllAnimals, createAnimal } from "@/service/AnimalService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "de";

    const animals = await getAllAnimals(locale);

    if (!animals || animals.length === 0) {
      console.warn(
        `[API] Keine Tiere für locale '${locale}' gefunden (Datenbank eventuell leer oder offline).`,
      );
    }

    return NextResponse.json(animals);
  } catch (error) {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "de";
    const t = await getTranslations({ locale, namespace: "api" });
    console.error("API Error during GET:", error);
    return NextResponse.json({ error: t("errors.load_error") }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const body = await request.json();

    const nameDe = body.animaltext?.find((t: any) => t.languageCode === "de")?.animalName;
    if (!nameDe || !body.biomeId) {
      return NextResponse.json(
        { message: t("animal.required_fields") },
        { status: 400 },
      );
    }

    const newAnimal = await createAnimal(body);

    return NextResponse.json({ id: newAnimal.id }, { status: 201 });
  } catch (error: any) {
    console.error("API Error during POST:", error);
    return NextResponse.json(
      { message: t("animal.create_error"), error: error.message },
      { status: 500 },
    );
  }
}
