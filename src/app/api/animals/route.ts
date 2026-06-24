export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAllAnimals, createAnimal } from "@/service/AnimalService";

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
    console.error("API Error during GET:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.nameDe || !body.enclosureType) {
      return NextResponse.json(
        { message: "Name (DE) und Gehegetyp sind Pflichtfelder." },
        { status: 400 },
      );
    }

    const newAnimal = await createAnimal(body);

    return NextResponse.json({ id: newAnimal.id }, { status: 201 });
  } catch (error: any) {
    console.error("API Error during POST:", error);
    return NextResponse.json(
      { message: "Fehler beim Erstellen des Tieres", error: error.message },
      { status: 500 },
    );
  }
}
