import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { updateRegion, deleteRegion } from "@/service/RegionService";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
    const regionId = parseInt(id, 10);

    if (isNaN(regionId)) {
      return NextResponse.json({ message: t("region.invalid_id") }, { status: 400 });
    }

    const body = await request.json();

    if (!body.identifier) {
      return NextResponse.json({ message: t("region.required_fields") }, { status: 400 });
    }

    const updated = await updateRegion(regionId, body);

    return NextResponse.json(
      { message: t("region.update_success"), id: updated.id },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Error during PUT /api/regions/[id]:", error);
    return NextResponse.json(
      { message: t("region.update_error"), error: error.message },
      { status: 500 },
    );
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
    const regionId = parseInt(id, 10);

    if (isNaN(regionId)) {
      return NextResponse.json({ message: t("region.invalid_id") }, { status: 400 });
    }

    await deleteRegion(regionId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("API Error during DELETE /api/regions/[id]:", error);
    return NextResponse.json(
      { message: t("region.delete_error"), error: error.message },
      { status: 500 },
    );
  }
}
