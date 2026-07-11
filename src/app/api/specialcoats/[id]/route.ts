import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getSpecialCoatById, updateSpecialCoat } from "@/service/SpecialCoatsService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const { id } = await params;
    const coat = await getSpecialCoatById(id, locale);

    if (!coat) {
      return NextResponse.json({ message: t("specialcoat.not_found") }, { status: 404 });
    }

    return NextResponse.json(coat);
  } catch (error) {
    console.error("GET SpecialCoat Error:", error);
    return NextResponse.json({ message: t("errors.load_error") }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "de";
  const t = await getTranslations({ locale, namespace: "api" });
  const tUser = await getTranslations({ locale, namespace: "user" });

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.roleId === 0 || session?.user?.role === "Mayor") {
      return NextResponse.json(
        {
          message: tUser("mayor_readonly_notice"),
          error: "MayorReadonly",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updatedCoat = await updateSpecialCoat(id, body);

    return NextResponse.json(updatedCoat);
  } catch (error: any) {
    console.error("PUT SpecialCoat Error:", error);

    if (error.message?.includes("Invalid ID")) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
    }

    return NextResponse.json({ message: t("specialcoat.update_error") }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "de";
  const t = await getTranslations({ locale, namespace: "api" });
  const tUser = await getTranslations({ locale, namespace: "user" });

  try {

    const session = await getServerSession(authOptions);

    if (session?.user?.roleId === 0 || session?.user?.role === "Mayor") {
      return NextResponse.json(
        {
          message: tUser("mayor_readonly_notice"),
          error: "MayorReadonly",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const coatId = Number(id);

    if (isNaN(coatId)) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.specialCoatsText.deleteMany({ where: { specialCoatId: coatId } }),
      prisma.specialCoatsOrigin.deleteMany({ where: { specialCoatId: coatId } }),
      prisma.specialCoat.delete({ where: { id: coatId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE SpecialCoat Error:", error);
    return NextResponse.json({ message: t("specialcoat.delete_error") }, { status: 500 });
  }
}
