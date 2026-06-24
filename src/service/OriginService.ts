import prisma from "@/lib/prisma";

export async function getAllOrigins() {
  return await prisma.origin.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
