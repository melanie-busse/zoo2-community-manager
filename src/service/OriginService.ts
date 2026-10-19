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

export async function getAllOriginsForOverview(locale: string = "de") {
  const result = await prisma.origin.findMany({
    include: {
      origintext: { where: { languageCode: locale } },
    },
  });

  return result.sort((a, b) => {
    const nameA = a.origintext[0]?.originName ?? "";
    const nameB = b.origintext[0]?.originName ?? "";
    return nameA.localeCompare(nameB);
  });
}

export async function getOriginById(id: number) {
  return prisma.origin.findUnique({
    where: { id },
    include: { origintext: true },
  });
}

interface OriginTextInput {
  languageCode: string;
  originName: string;
  originDescription: string;
}

interface OriginPayload {
  identifier: string;
  texts: OriginTextInput[];
}

export async function createOrigin(data: OriginPayload) {
  const created = await prisma.origin.create({
    data: {
      identifier: data.identifier,
      origintext: {
        create: data.texts.map((tx) => ({
          languageCode: tx.languageCode,
          originName: tx.originName,
          originDescription: tx.originDescription,
        })),
      },
    },
  });
  return { id: created.id };
}

export async function updateOrigin(id: number, data: OriginPayload) {
  await prisma.origin.update({
    where: { id },
    data: {
      identifier: data.identifier,
      origintext: {
        upsert: data.texts.map((tx) => ({
          where: {
            originId_languageCode: {
              originId: id,
              languageCode: tx.languageCode,
            },
          },
          create: {
            languageCode: tx.languageCode,
            originName: tx.originName,
            originDescription: tx.originDescription,
          },
          update: {
            originName: tx.originName,
            originDescription: tx.originDescription,
          },
        })),
      },
    },
  });
}

export async function deleteOrigin(id: number) {
  await prisma.origin.delete({ where: { id } });
}
