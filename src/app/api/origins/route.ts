import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole } from "@/utils/roleUtils";
import { createOrigin } from "@/service/OriginService";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!hasMinimumRole(session, "Director")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  const result = await createOrigin(data);
  return NextResponse.json(result);
}
