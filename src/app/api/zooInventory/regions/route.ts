import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { upsertRegionInventory } from "@/service/RegionInventoryService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: t("errors.unauthorized") },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { regionId, field, value } = body;

    if (!regionId || !field) {
      return NextResponse.json(
        { message: t("errors.required_fields") },
        { status: 400 },
      );
    }

    await upsertRegionInventory(parseInt(session.user.id), regionId, field, value);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[API] Error during POST /api/zooInventory/regions:", error);
    return NextResponse.json(
      { message: t("errors.save_error"), error: error.message },
      { status: 500 },
    );
  }
}
