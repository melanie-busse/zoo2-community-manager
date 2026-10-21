import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { getAllCollectionsForAdmin, createCollection } from "@/service/CollectionService";

export async function GET() {
  try {
    const collections = await getAllCollectionsForAdmin();
    return Response.json(collections);
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (isMayor(session)) return Response.json({ message: "Forbidden" }, { status: 403 });
  if (!hasMinimumRole(session, "Director"))
    return Response.json({ message: "Unauthorized" }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.regionId) {
      return Response.json({ message: "regionId is required" }, { status: 400 });
    }
    if (!Array.isArray(body.texts) || body.texts.length === 0) {
      return Response.json({ message: "At least one text entry is required" }, { status: 400 });
    }
    const result = await createCollection(body);
    return Response.json({ id: result.id }, { status: 201 });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
