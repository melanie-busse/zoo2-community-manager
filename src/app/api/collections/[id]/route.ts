import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { updateCollection, deleteCollection } from "@/service/CollectionService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (isMayor(session)) return Response.json({ message: "Forbidden" }, { status: 403 });
  if (!hasMinimumRole(session, "Director"))
    return Response.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const collectionId = parseInt(id, 10);
  if (isNaN(collectionId)) return Response.json({ message: "Invalid ID" }, { status: 400 });

  try {
    const body = await request.json();
    if (!body.regionId) {
      return Response.json({ message: "regionId is required" }, { status: 400 });
    }
    if (!Array.isArray(body.texts) || body.texts.length === 0) {
      return Response.json({ message: "At least one text entry is required" }, { status: 400 });
    }
    await updateCollection(collectionId, body);
    return Response.json({ id: collectionId });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (isMayor(session)) return Response.json({ message: "Forbidden" }, { status: 403 });
  if (!hasMinimumRole(session, "Director"))
    return Response.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const collectionId = parseInt(id, 10);
  if (isNaN(collectionId)) return Response.json({ message: "Invalid ID" }, { status: 400 });

  try {
    await deleteCollection(collectionId);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
