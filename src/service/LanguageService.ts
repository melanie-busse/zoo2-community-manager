import "server-only";
import prisma from "@/lib/prisma";

export async function getAllLanguages() {
  try {
    return await prisma.language.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("[LanguageService] Error in getAllLanguages:", error);
    return [];
  }
}
