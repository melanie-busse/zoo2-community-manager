import { NextResponse } from "next/server";

import { updateAnimal, deleteAnimal } from "@/service/AnimalService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const animalId = parseInt(id, 10);

    if (isNaN(animalId)) {
      return NextResponse.json({ message: "Ungültige Tier-ID" }, { status: 400 });
    }

    const body = await request.json();

    const nameDe = body.animaltext?.find((t: any) => t.languageCode === "de")?.animalName;
    if (!nameDe || !body.biomeId) {
      return NextResponse.json(
        { message: "Name (DE) und Gehegetyp sind Pflichtfelder." },
        { status: 400 },
      );
    }

    const updatedAnimal = await updateAnimal(animalId, body);

    return NextResponse.json(
      { message: "Tier erfolgreich aktualisiert", id: updatedAnimal.id },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Error during PUT:", error);
    return NextResponse.json(
      { message: "Fehler beim Aktualisieren des Tieres", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const animalId = parseInt(id, 10);

    if (isNaN(animalId)) {
      return NextResponse.json({ message: "Ungültige Tier-ID" }, { status: 400 });
    }

    await deleteAnimal(animalId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("API Error during DELETE:", error);
    return NextResponse.json(
      { message: "Fehler beim Löschen des Tieres", error: error.message },
      { status: 500 },
    );
  }
}
