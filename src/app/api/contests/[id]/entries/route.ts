import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createContestEntries, getEntriesByContestAndUser } from "@/service/ContestService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const { id } = await params;
    const contestId = parseInt(id);

    if (isNaN(contestId) || !userId) {
      return NextResponse.json({ message: "Invalid parameters" }, { status: 400 });
    }

    const entries = await getEntriesByContestAndUser(contestId, parseInt(userId));
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error("API Error [Get Contest Entries]:", error);
    return NextResponse.json({ message: "Error loading entries" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 401 });
    }

    const { id } = await params;
    const contestId = parseInt(id);
    if (isNaN(contestId)) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
    }

    const body = await request.json();
    const { userId, entries } = body;

    if (!userId || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ message: t("errors.invalid_id") }, { status: 400 });
    }

    await createContestEntries(contestId, parseInt(userId), entries);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("API Error [Contest Entries]:", error);
    return NextResponse.json({ message: t("contest.entry_error") }, { status: 500 });
  }
}