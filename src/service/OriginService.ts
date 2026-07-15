import prisma from "@/lib/prisma";

export async function getAllOrigins(locale: string = "de") {
  const result = await prisma.origin.findMany({
    include: {
      origintext: locale ? { where: { languageCode: locale } } : true,
    },
  });

  return result
    .map((origin) => ({
      ...origin,
      name: origin.origintext?.[0]?.originName ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}