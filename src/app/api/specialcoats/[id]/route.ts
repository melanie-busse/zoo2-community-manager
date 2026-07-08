import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSpecialCoatById, updateSpecialCoat } from "@/service/SpecialCoatsService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") ?? "de";

    const { id } = await params;
    const coat = await getSpecialCoatById(id, locale);

    if (!coat) {
      return NextResponse.json({ message: "Farbvariante nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(coat);
  } catch (error) {
    console.error("GET SpecialCoat Error:", error);
    return NextResponse.json({ message: "Fehler beim Laden" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedCoat = await updateSpecialCoat(id, body);

    return NextResponse.json(updatedCoat);
  } catch (error: any) {
    console.error("PUT SpecialCoat Error:", error);

    if (error.message?.includes("Invalid ID")) {
      return NextResponse.json({ message: "Ungültige ID" }, { status: 400 });
    }

    return NextResponse.json({ message: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const coatId = Number(id);

    if (isNaN(coatId)) {
      return NextResponse.json({ message: "Ungültige ID" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.specialCoatsText.deleteMany({ where: { specialCoatId: coatId } }),
      prisma.specialCoatsOrigin.deleteMany({ where: { specialCoatId: coatId } }),
      prisma.specialCoat.delete({ where: { id: coatId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE SpecialCoat Error:", error);
    return NextResponse.json({ message: "Fehler beim Löschen" }, { status: 500 });
  }
}