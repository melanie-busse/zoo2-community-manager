import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { updateChestBoost, deleteChestBoost } from "@/service/ChestBoostService";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_CHEST_TYPES = ["EPIC", "RETRO", "LEGENDARY"] as const;

export async function PUT(request: Request, { params }: RouteParams) {
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

    const { id } = await params;
    const boostId = parseInt(id, 10);

    if (isNaN(boostId)) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
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

    const result = await updateChestBoost(boostId, {
      startDate: body.startDate,
      endDate: body.endDate,
      chestType: body.chestType,
      isEvent: body.isEvent ?? false,
      animalId: body.animalId,
    });

    return NextResponse.json({ id: result.id }, { status: 200 });
  } catch (error: any) {
    console.error("API Error during PUT /api/chest-boosts/[id]:", error);
    return NextResponse.json({ message: t("errors.save_error"), error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(_request.url);
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

    const { id } = await params;
    const boostId = parseInt(id, 10);

    if (isNaN(boostId)) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
    }

    await deleteChestBoost(boostId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("API Error during DELETE /api/chest-boosts/[id]:", error);
    return NextResponse.json({ message: t("errors.server_error"), error: error.message }, { status: 500 });
  }
}
