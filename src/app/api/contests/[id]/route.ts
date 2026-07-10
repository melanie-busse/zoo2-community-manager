import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteContest, updateContest } from "@/service/ContestService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "Director") {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = await updateContest(parseInt(id), body);

    return NextResponse.json({ success: true, contest: result }, { status: 200 });
  } catch (error) {
    console.error("API Error [Contests]:", error);
    return NextResponse.json({ message: t("contest.update_error") }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "Director") {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 403 });
    }

    const { id } = await params;
    const contestId = parseInt(id);

    if (isNaN(contestId)) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
    }

    await deleteContest(contestId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Delete Contest]:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ message: t("contest.not_found") }, { status: 404 });
    }

    return NextResponse.json({ message: t("contest.delete_error") }, { status: 500 });
  }
}
