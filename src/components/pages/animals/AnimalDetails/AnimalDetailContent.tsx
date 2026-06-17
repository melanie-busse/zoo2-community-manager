"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import HeaderCard from "./HeaderCard";
import SpecialCoatArea from "./SpecialCoatArea";
import AccordionCard from "./AccordionCard";
import { Animal } from "@/types/animal";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import Textarea from "@/components/ui/form/Textarea";

interface AnimalDetailContentProps {
  animal: Animal | null;
  onDelete: () => Promise<void>;
  onEdit: () => void;
}

export default function AnimalDetailContent({
  animal,
  onDelete,
  onEdit,
}: AnimalDetailContentProps) {
  const tAnimals = useTranslations("Animals");
  const tCommon = useTranslations("Common");

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "Director";

  if (!animal) {
    return <div>{tCommon("not_found")}</div>;
  }

  const translation = animal.animaltext?.[0];
  const displayDescription = translation?.animalDescription;

  return (
    <Wrapper>
      {isAdmin && (
        <TopBar>
          <ActionGroupBadge object="animals" onEdit={onEdit} onDelete={onDelete} />
        </TopBar>
      )}

      <HeaderCard animal={animal} />

      <MainGrid>
        <PrimaryColumn>
          <Textarea
            label={tCommon("description")}
            text={displayDescription ?? tCommon("noDescriptionAvailable")}
          />

          <SpecialCoatArea animal={animal} specialCode={animal.specialcoat} />
        </PrimaryColumn>

        <SecondaryColumn>
          <AccordionCard animal={animal} />
        </SecondaryColumn>
      </MainGrid>
    </Wrapper>
  );
}

// --- Styled Components ---
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    /* Hebelt das Padding des Elternelements radikal aus */
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);

    /* Bestimme hier jetzt deinen WUNSCH-Abstand zum echten Displayrand */
    padding-left: 8px; /* Ändere das auf 4px oder 0px, wenn es noch schmaler sein soll! */
    padding-right: 8px;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: -10px;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    /* Gibt den Admin-Buttons einen minimalen Abstand vom Rand */
    padding: 0 8px;
  }
`;

const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    /* Schrumpft die Boxen minimal, damit links und rechts ein perfekter, kleiner Spalt entsteht */
    width: calc(100% - 16px);
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1.8fr 1.2fr;
    align-items: start;
    gap: 25px;
    width: 100%;
  }
`;

const PrimaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
`;

const SecondaryColumn = styled.div`
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    position: sticky;
    top: 20px;
  }
`;
