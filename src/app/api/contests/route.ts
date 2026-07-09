import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getTranslations } from "next-intl/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createContest } from "@/service/ContestService";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "de";
  const t = await getTranslations({ locale, namespace: "api" });

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: t("errors.unauthorized") }, { status: 401 });
    }

    const body = await req.json();
    const result = await createContest(body);

    return NextResponse.json({ success: true, contest: result }, { status: 201 });
  } catch (error) {
    console.error("API Error [Contests]:", error);
    return NextResponse.json({ message: t("contest.create_error") }, { status: 500 });
  }
}
