import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateContest } from "@/service/ContestService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Session prüfen
    const session = await getServerSession(authOptions);

    // Zugriffsschutz: Nur eingeloggte User (oder später spezifische Rollen)
    if (!session || session.user?.role !== "Director") {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 403 });
    }

    const { id } = await params;

    // 2. Body parsen (im App Router asynchron!)
    const body = await request.json();

    // 3. Service aufrufen
    const result = await updateContest(parseInt(id), body);

    // 4. Erfolgsantwort senden
    return NextResponse.json({ success: true, contest: result }, { status: 200 });
  } catch (error) {
    console.error("API Error [Contests]:", error);

    // Differenzierung zwischen Validierungsfehlern und Serverfehlern
    return NextResponse.json({ message: "Fehler beim Erstellen des Contests" }, { status: 500 });
  }
}
