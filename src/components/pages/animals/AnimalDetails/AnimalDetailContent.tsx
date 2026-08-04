"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import * as Styles from "./AnimalDetails.styles";

import HeaderCard from "./HeaderCard";
import SpecialCoatArea from "./SpecialCoatArea";
import StatueArea from "./StatueArea";
import AccordionCard from "./AccordionCard";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import Textarea from "@/components/page-structure/Elements/Textarea";
import { useAnimalStore } from "@/store/useAnimalStore";
import { useRouter } from "@/i18n/routing";

export default function AnimalDetailContent({}) {
  const animal = useAnimalStore((state) => state.selectedAnimal);
  const setEditingAnimal = useAnimalStore((state) => state.setEditingAnimal);
  const deleteAnimal = useAnimalStore((state) => state.deleteAnimal);

  const tAnimal = useTranslations("animal");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  if (!animal) {
    return <div>{tCommon("not_found")}</div>;

  }

  const translation = animal.animaltext?.[0];
  const displayDescription = translation?.animalDescription;

  return (
    <Styles.Wrapper>
      {isAdmin && (
        <Styles.TopBar>
          <ActionGroupBadge
              id={animal.id}
              onEdit={() => {
                setEditingAnimal(animal);
                router.push(`/animals/${animal.id}/edit`);
              }}
              onDelete={async () => {
                const success = await deleteAnimal(animal.id, tAnimal, tCommon);
                if (success) router.push("/animals");
              }}
            />
        </Styles.TopBar>
      )}

      <HeaderCard />

      <Styles.MainGrid>
        <Styles.PrimaryColumn>
          <Textarea
            label={tCommon("description")}
            text={displayDescription ?? tCommon("noDescriptionAvailable")}
          />

          <SpecialCoatArea />
          <StatueArea />
        </Styles.PrimaryColumn>

        <Styles.SecondaryColumn>
          <AccordionCard />
        </Styles.SecondaryColumn>
      </Styles.MainGrid>
    </Styles.Wrapper>
  );
}
