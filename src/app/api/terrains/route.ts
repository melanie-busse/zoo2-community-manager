import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import { createTerrain } from "@/service/TerrainService";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  const terrain = await createTerrain(data);
  return NextResponse.json(terrain, { status: 201 });
}
