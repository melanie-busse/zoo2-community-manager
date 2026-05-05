import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteContest, updateContest } from "@/service/ContestService";

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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    // Berechtigungsprüfung (Director-Rolle)
    if (!session || session.user?.role !== "Director") {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 403 });
    }

    const { id } = await params;
    const contestId = parseInt(id);

    if (isNaN(contestId)) {
      return NextResponse.json({ message: "Ungültige ID" }, { status: 400 });
    }

    // Löschvorgang starten
    await deleteContest(contestId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("API Error [Delete Contest]:", error);

    // Falls Prisma den Datensatz nicht findet (P2025)
    if (error.code === "P2025") {
      return NextResponse.json({ message: "Contest nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({ message: "Fehler beim Löschen" }, { status: 500 });
  }
}
