import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { createRegion } from "@/service/RegionService";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

export const dynamic = "force-dynamic";

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

    if (!body.identifier || !(body.regionTexts ?? []).some((t: any) => t.name !== "")) {
      return NextResponse.json({ message: t("region.required_fields") }, { status: 400 });
    }

    const region = await createRegion(body);

    return NextResponse.json({ id: region.id }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Error during POST /api/regions:", error);
    return NextResponse.json(
      { message: t("region.create_error"), error: error.message },
      { status: 500 },
    );
  }
}
