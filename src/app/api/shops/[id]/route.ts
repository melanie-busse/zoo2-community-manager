import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { getShopById, updateShop, deleteShop } from "@/service/ShopService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const shopId = parseInt(id, 10);
  if (isNaN(shopId)) return Response.json({ message: "Invalid ID" }, { status: 400 });

  try {
    const shop = await getShopById(shopId);
    if (!shop) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(shop);
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (isMayor(session)) return Response.json({ error: "MayorReadonly" }, { status: 403 });
  if (!hasMinimumRole(session, "Director"))
    return Response.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const shopId = parseInt(id, 10);
  if (isNaN(shopId)) return Response.json({ message: "Invalid ID" }, { status: 400 });

  try {
    const body = await request.json();
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return Response.json({ message: "Name is required" }, { status: 400 });
    }
    await updateShop(shopId, body);
    return Response.json({ id: shopId });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (isMayor(session)) return Response.json({ error: "MayorReadonly" }, { status: 403 });
  if (!hasMinimumRole(session, "Director"))
    return Response.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const shopId = parseInt(id, 10);
  if (isNaN(shopId)) return Response.json({ message: "Invalid ID" }, { status: 400 });

  try {
    await deleteShop(shopId);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
