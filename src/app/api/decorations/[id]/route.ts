import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import { updateBiomeDecoration, deleteBiomeDecoration } from "@/service/BiomeService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const decorationId = parseInt(id, 10);
  const data = await req.json();
  await updateBiomeDecoration(decorationId, data);
  return NextResponse.json({ id: decorationId });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const decorationId = parseInt(id, 10);
  await deleteBiomeDecoration(decorationId);
  return NextResponse.json({ success: true });
}
