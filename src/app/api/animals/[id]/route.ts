import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

import { updateAnimal, deleteAnimal } from "@/service/AnimalService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const { id } = await params;
    const animalId = parseInt(id, 10);

    if (isNaN(animalId)) {
      return NextResponse.json({ message: t("animal.invalid_id") }, { status: 400 });
    }

    const body = await request.json();

    const nameDe = body.animaltext?.find((entry: any) => entry.languageCode === "de")?.animalName;
    if (!nameDe || !body.biomeId) {
      return NextResponse.json(
        { message: t("animal.required_fields") },
        { status: 400 },
      );
    }

    const updatedAnimal = await updateAnimal(animalId, body);

    return NextResponse.json(
      { message: t("animal.update_success"), id: updatedAnimal.id },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Error during PUT:", error);
    return NextResponse.json(
      { message: t("animal.update_error"), error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(_request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const { id } = await params;
    const animalId = parseInt(id, 10);

    if (isNaN(animalId)) {
      return NextResponse.json({ message: t("animal.invalid_id") }, { status: 400 });
    }

    await deleteAnimal(animalId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("API Error during DELETE:", error);
    return NextResponse.json(
      { message: t("animal.delete_error"), error: error.message },
      { status: 500 },
    );
  }
}
