import { createSpecialCoat, getAllSpecialCoats } from "@/service/SpecialCoatsService";

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "de";

    const specialCoats = await getAllSpecialCoats(locale);

    if (!specialCoats || specialCoats.length === 0) {
      console.warn(`[API] Keine Farbvarianten für locale '${locale}' gefunden.`);
    }

    return NextResponse.json(specialCoats);
  } catch (error) {
    console.error("API Error during GET (SpecialCoats):", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validierung: Mindestens ein Tier muss zugewiesen sein und Texte müssen da sein
    if (!body.animalId || !body.texts || body.texts.length === 0) {
      return NextResponse.json(
        { message: "Tier-ID und Übersetzungen sind Pflichtfelder." },
        { status: 400 },
      );
    }

    // Ruft unseren neuen Service auf
    const newCoat = await createSpecialCoat(body);

    return NextResponse.json({ id: newCoat?.id }, { status: 201 });
  } catch (error: any) {
    console.error("API Error during POST (SpecialCoats):", error);
    return NextResponse.json(
      { message: "Fehler beim Erstellen der Farbvariante", error: error.message },
      { status: 500 },
    );
  }
}
