import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getAllChestBoosts, createChestBoost } from "@/service/ChestBoostService";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

export const dynamic = "force-dynamic";

const VALID_CHEST_TYPES = ["EPIC", "RETRO", "LEGENDARY"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";

  try {
    const boosts = await getAllChestBoosts(locale);
    return NextResponse.json(boosts);
  } catch (error) {
    const t = await getTranslations({ locale, namespace: "api" });
    console.error("[API] Error during GET /api/chest-boosts:", error);
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

    if (
      !body.animalId ||
      typeof body.animalId !== "number" ||
      !body.startDate ||
      !body.endDate ||
      !VALID_CHEST_TYPES.includes(body.chestType)
    ) {
      return NextResponse.json({ message: t("errors.required_fields") }, { status: 400 });
    }

    if (new Date(body.endDate) <= new Date(body.startDate)) {
      return NextResponse.json({ message: t("errors.required_fields") }, { status: 400 });
    }

    const result = await createChestBoost({
      startDate: body.startDate,
      endDate: body.endDate,
      chestType: body.chestType,
      isEvent: body.isEvent ?? false,
      animalId: body.animalId,
    });

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Error during POST /api/chest-boosts:", error);
    return NextResponse.json({ message: t("errors.save_error"), error: error.message }, { status: 500 });
  }
}
