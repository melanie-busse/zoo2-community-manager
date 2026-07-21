import { NextResponse } from "next/server";
import { syncBreedingChancesFromApi } from "@/service/FandomService";

export async function POST() {
  try {
    await syncBreedingChancesFromApi();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Breeding chances sync error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}