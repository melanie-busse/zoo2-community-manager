import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { getAllShops, createShop } from "@/service/ShopService";

export async function GET() {
  try {
    const shops = await getAllShops();
    return Response.json(shops);
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (isMayor(session)) return Response.json({ error: "MayorReadonly" }, { status: 403 });
  if (!hasMinimumRole(session, "Director"))
    return Response.json({ message: "Unauthorized" }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return Response.json({ message: "Name is required" }, { status: 400 });
    }
    const shop = await createShop(body);
    return Response.json({ id: shop.id }, { status: 201 });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
