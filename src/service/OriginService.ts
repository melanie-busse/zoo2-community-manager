import prisma from "@/lib/prisma";

export async function getAllOrigins(locale: string = "de") {

  const result = await prisma.origin.findMany({
    include: {
      origintext: locale ? { where: { languageCode: locale } } : true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return result.map((origin) => ({
    ...origin,
    name: origin.origintext?.[0]?.originName ?? origin.name,
  }));
}
