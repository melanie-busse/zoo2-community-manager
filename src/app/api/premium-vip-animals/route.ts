import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PremiumVipType } from "@prisma/client";
import {
  getPremiumVipAnimals,
  getAvailableYears,
  createEntry,
  updateEntry,
  deleteEntry,
} from "@/service/PremiumVipAnimalService";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

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

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });
  const tUser = await getTranslations({ locale, namespace: "user" });

  try {
    const session = await getServerSession(authOptions);

    if (isMayor(session)) {
      return NextResponse.json(
        { message: tUser("mayor_readonly_notice"), error: "MayorReadonly" },
        { status: 403 },
      );
    }
    if (!hasMinimumRole(session, "Director")) {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 403 });
    }

    const body = await request.json();
    if (!body.type || !VALID_TYPES.includes(body.type) || !body.year || !body.dateLabel || !body.animalName) {
      return NextResponse.json({ message: t("errors.required_fields") }, { status: 400 });
    }

    const result = await createEntry({
      type: body.type,
      year: parseInt(body.year, 10),
      dateLabel: body.dateLabel,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      animalName: body.animalName,
      animalId: body.animalId ?? null,
      isNpc: body.isNpc ?? false,
    });

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Error during POST /api/premium-vip-animals:", error);
    return NextResponse.json({ message: t("errors.save_error"), error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });
  const tUser = await getTranslations({ locale, namespace: "user" });

  try {
    const session = await getServerSession(authOptions);

    if (isMayor(session)) {
      return NextResponse.json(
        { message: tUser("mayor_readonly_notice"), error: "MayorReadonly" },
        { status: 403 },
      );
    }
    if (!hasMinimumRole(session, "Director")) {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 403 });
    }

    const body = await request.json();
    const id = parseInt(searchParams.get("id") ?? "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: t("errors.required_fields") }, { status: 400 });
    }
    if (!body.type || !VALID_TYPES.includes(body.type) || !body.year || !body.dateLabel || !body.animalName) {
      return NextResponse.json({ message: t("errors.required_fields") }, { status: 400 });
    }

    const result = await updateEntry(id, {
      type: body.type,
      year: parseInt(body.year, 10),
      dateLabel: body.dateLabel,
      startDate: body.startDate ?? null,
      endDate: body.endDate ?? null,
      animalName: body.animalName,
      animalId: body.animalId ?? null,
      isNpc: body.isNpc ?? false,
    });

    return NextResponse.json({ id: result.id });
  } catch (error: any) {
    console.error("[API] Error during PUT /api/premium-vip-animals:", error);
    return NextResponse.json({ message: t("errors.save_error"), error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });
  const tUser = await getTranslations({ locale, namespace: "user" });

  try {
    const session = await getServerSession(authOptions);

    if (isMayor(session)) {
      return NextResponse.json(
        { message: tUser("mayor_readonly_notice"), error: "MayorReadonly" },
        { status: 403 },
      );
    }
    if (!hasMinimumRole(session, "Director")) {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 403 });
    }

    const id = parseInt(searchParams.get("id") ?? "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: t("errors.required_fields") }, { status: 400 });
    }

    await deleteEntry(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("[API] Error during DELETE /api/premium-vip-animals:", error);
    return NextResponse.json({ message: t("errors.save_error"), error: error.message }, { status: 500 });
  }
}
