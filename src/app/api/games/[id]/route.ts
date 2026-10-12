import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import { updateBiomeGame } from "@/service/BiomeService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const gameId = parseInt(id, 10);
  const data = await req.json();
  await updateBiomeGame(gameId, data);
  return NextResponse.json({ id: gameId });
}
