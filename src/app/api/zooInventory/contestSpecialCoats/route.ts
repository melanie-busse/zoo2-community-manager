import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateZooInventoryContestSpecialCoat } from "@/service/ZooInventoryService";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { specialCoatId, field, value } = body;

  if (!specialCoatId || !field) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await updateZooInventoryContestSpecialCoat(
      session.user.id,
      specialCoatId,
      field,
      value,
    );
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/zooInventory/contestSpecialCoats]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
