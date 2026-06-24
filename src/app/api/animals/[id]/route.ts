import { NextResponse } from "next/server";
import { updateAnimal } from "@/service/AnimalService";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const animalId = parseInt(params.id, 10);
    if (isNaN(animalId)) {
      return NextResponse.json({ message: "Ungültige Tier-ID" }, { status: 400 });
    }

    const body = await request.json();

    if (!body.nameDe || !body.biomeId) {
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
