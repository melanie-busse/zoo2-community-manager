import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { createContest } from "@/service/ContestService";

export async function POST(req: Request) {
  try {
    // 1. Session prüfen
    const session = await getServerSession(authOptions);

    // Zugriffsschutz: Nur eingeloggte User (oder später spezifische Rollen)
    if (!session) {
      return NextResponse.json({ message: "Nicht autorisiert" }, { status: 401 });
    }

    // 2. Body parsen (im App Router asynchron!)
    const body = await req.json();
    // 3. Service aufrufen
    const result = await createContest(body);

    // 4. Erfolgsantwort senden
    return NextResponse.json({ success: true, contest: result }, { status: 201 });
  } catch (error) {
    console.error("API Error [Contests]:", error);

    // Differenzierung zwischen Validierungsfehlern und Serverfehlern
    return NextResponse.json({ message: "Fehler beim Erstellen des Contests" }, { status: 500 });
  }
}
