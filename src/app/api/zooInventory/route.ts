import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { updateZooInventory } from "@/service/ZooInventoryService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: t("errors.unauthorized") || "Nicht autorisiert" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { specialCoatId, field, value } = body;

    if (!specialCoatId || !field) {
      return NextResponse.json(
        { message: t("errors.required_fields") || "Pflichtfelder fehlen" },
        { status: 400 },
      );
    }

    const updated = await updateZooInventory(session.user.id, specialCoatId, field, value);

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("[API] Error during Zoo-Inventory POST:", error);
    return NextResponse.json(
      { message: t("errors.save_error") || "Fehler beim Speichern", error: error.message },
      { status: 500 },
    );
  }
}
