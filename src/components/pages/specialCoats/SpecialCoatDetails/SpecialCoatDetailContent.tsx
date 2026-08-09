"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

import SpecialCoatHeaderCard from "./SpecialCoatHeaderCard";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { useSpecialCoatStore } from "@/store/useSpecialCoatStore";
import { useAnimalStore } from "@/store/useAnimalStore";
import { useRouter } from "@/i18n/routing";
import BreedingSection from "@/components/pages/specialCoats/SpecialCoatDetails/BreedingSection";

export default function SpecialCoatDetailContent() {
  const specialCoat = useSpecialCoatStore((state) => state.selectedSpecialCoat);
  const setEditingSpecialCoat = useSpecialCoatStore((state) => state.setEditingSpecialCoat);
  const deleteSpecialCoat = useSpecialCoatStore((state) => state.deleteSpecialCoat);
  const animal = useAnimalStore((state) => state.selectedAnimal);

  const tSpecialCoat = useTranslations("specialCoat");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  if (!specialCoat) {
    return <div>{tCommon("not_found")}</div>;
  }

  const displayDescription = animal?.animaltext?.[0]?.animalDescription;

  return (
    <Styles.Wrapper>
      {isAdmin && (
        <Styles.TopBar>
          <ActionGroupBadge
            id={specialCoat.id}
            onEdit={() => {
              setEditingSpecialCoat(specialCoat);
              router.push(`/specialcoats/${specialCoat.id}/edit`);
            }}
            onDelete={async () => {
              const success = await deleteSpecialCoat(specialCoat.id, tSpecialCoat, tCommon);
              if (success) router.push("/specialcoats");
            }}
          />
        </Styles.TopBar>
      )}

      <SpecialCoatHeaderCard />
      <BreedingSection />
    </Styles.Wrapper>
  );
}
