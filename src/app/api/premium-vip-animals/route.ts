import { NextResponse } from "next/server";
import { PremiumVipType } from "@prisma/client";
import { getPremiumVipAnimals, getAvailableYears } from "@/service/PremiumVipAnimalService";

export const dynamic = "force-dynamic";

const VALID_TYPES: PremiumVipType[] = ["PREMIUM", "VIP"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const typeParam = searchParams.get("type");
  if (!typeParam || !VALID_TYPES.includes(typeParam as PremiumVipType)) {
    return NextResponse.json({ error: "Invalid or missing type parameter" }, { status: 400 });
  }

  const type = typeParam as PremiumVipType;
  const animalName = searchParams.get("animalName") || undefined;
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);

  try {
    const [result, availableYears] = await Promise.all([
      getPremiumVipAnimals(type, { animalName, year, page, pageSize }),
      getAvailableYears(type),
    ]);

    return NextResponse.json({ ...result, availableYears });
  } catch (error) {
    console.error("[API] Error during GET /api/premium-vip-animals:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
