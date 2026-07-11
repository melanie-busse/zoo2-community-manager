import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getAllAnimals, createAnimal } from "@/service/AnimalService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";

  try {
    const animals = await getAllAnimals(locale);

    if (!animals || animals.length === 0) {
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
  const tUser = await getTranslations({ locale, namespace: "user" });

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.roleId === 0 || session?.user?.role === "Mayor") {
      return NextResponse.json(
        {
          message: tUser("mayor_readonly_notice"),
          error: "MayorReadonly",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

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
