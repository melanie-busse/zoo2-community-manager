import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSpecialCoatById } from "@/service/SpecialCoatsService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") ?? "de";

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
    const coatId = Number(id);

    if (isNaN(coatId)) {
      return NextResponse.json({ message: "Ungültige ID" }, { status: 400 });
    }

    const body = await request.json();
    const { animalId, releaseDate, image, originIds, texts } = body;

    const updatedCoat = await prisma.$transaction(async (tx) => {
      const coat = await tx.specialCoat.update({
        where: { id: coatId },
        data: {
          animalId: Number(animalId),
          releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
          image: image || null,
        },
      });

      if (Array.isArray(originIds)) {
        await tx.specialCoatsOrigin.deleteMany({
          where: { specialCoatId: coatId },
        });

        if (originIds.length > 0) {
          await tx.specialCoatsOrigin.createMany({
            data: originIds.map((originId: number) => ({
              specialCoatId: coatId,
              originId: Number(originId),
            })),
          });
        }
      }

      if (Array.isArray(texts)) {
        for (const text of texts) {
          await tx.specialCoatsText.upsert({
            where: {
              specialCoatId_languageCode: {
                specialCoatId: coatId,
                languageCode: text.languageCode,
              },
            },
            update: {
              name: text.name,
              color: text.color,
            },
            create: {
              specialCoatId: coatId,
              languageCode: text.languageCode,
              name: text.name,
              color: text.color,
            },
          });
        }
      }

      return coat;
    });

    return NextResponse.json(updatedCoat);
  } catch (error) {
    console.error("PUT SpecialCoat Error:", error);
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
