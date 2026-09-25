import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchPagesFromCategory } from "@/service/FandomService";

export async function GET() {
  try {
    // 1. Alle englischen Seitentitel aus der Wiki-Kategorie holen
    const wikiTitles = await fetchPagesFromCategory("Animal");

    if (wikiTitles.length === 0) {
      return NextResponse.json({ error: "Keine Tiere aus dem Wiki geladen." }, { status: 502 });
    }

    // 2. Alle existierenden englischen Namen aus der AnimalText-Tabelle holen
    // Da das Wiki englisch ist, matchen wir gegen die dort hinterlegten Namen.
    const dbAnimalTexts = await prisma.animalText.findMany({
      select: {
        animalName: true,
        animal: {
          select: {
            id: true,
            biome: {
              select: {
                id: true,
                identifier: true,
                biomestext: { select: { id: true, biomeName: true, biomeDescription: true } },
              },
            },
          },
        },
      },
    });

    // Map für schnellen O(1) Abgleich erstellen (alles in Lowercase für fehlertoleranten Vergleich)
    const dbNameToAnimal = new Map(
      dbAnimalTexts.map((t) => [
        t.animalName.toLowerCase(),
        { id: t.animal?.id ?? null, biome: t.animal?.biome ?? null },
      ]),
    );

    // 3. Status für jedes Wiki-Tier bestimmen
    const comparisonList = wikiTitles.map((title) => {
      const key = title.toLowerCase();
      const dbAnimal = dbNameToAnimal.get(key) ?? null;
      const isImported = dbAnimal !== null;
      return {
        title,
        status: isImported ? "imported" : "missing",
        animalId: isImported ? (dbAnimal?.id ?? null) : null,
        biome: isImported ? (dbAnimal?.biome ?? null) : null,
      };
    });

    // Statistik berechnen
    const total = comparisonList.length;
    const importedCount = comparisonList.filter((item) => item.status === "imported").length;
    const missingCount = total - importedCount;

    return NextResponse.json({
      summary: {
        total,
        imported: importedCount,
        missing: missingCount,
      },
      animals: comparisonList,
    });
  } catch (error: any) {
    console.error("Status-Abgleich Fehler:", error);
    return NextResponse.json({ error: error.message || "Interner Serverfehler" }, { status: 500 });
  }
}
