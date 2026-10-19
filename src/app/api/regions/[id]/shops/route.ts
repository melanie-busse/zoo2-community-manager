import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { getShopsByRegionId, createShop } from "@/service/RegionService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const regionId = parseInt(id, 10);

  if (isNaN(regionId)) {
    const t = await getTranslations({ locale: "de", namespace: "api" });
    return NextResponse.json({ message: t("region.invalid_id") }, { status: 400 });
  }

  try {
    const shops = await getShopsByRegionId(regionId);
    return NextResponse.json(shops);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });
  const tUser = await getTranslations({ locale, namespace: "user" });

  const { id } = await params;
  const regionId = parseInt(id, 10);

  if (isNaN(regionId)) {
    return NextResponse.json({ message: t("region.invalid_id") }, { status: 400 });
  }

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

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ message: t("errors.name_required") }, { status: 400 });
    }

    const shop = await createShop(regionId, body);
    return NextResponse.json(shop, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
