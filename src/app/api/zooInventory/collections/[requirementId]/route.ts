import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ requirementId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requirementId } = await params;
  const reqId = parseInt(requirementId);
  const { completed } = await req.json();
  const userId = parseInt(session.user.id);

  await prisma.zooInventoryCollection.upsert({
    where: {
      userId_collectionRequirementId: {
        userId,
        collectionRequirementId: reqId,
      },
    },
    update: { completed },
    create: { userId, collectionRequirementId: reqId, completed },
  });

  return NextResponse.json({ ok: true });
}
