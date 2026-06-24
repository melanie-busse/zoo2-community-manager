"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import * as Styles from "./AnimalForms.style";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputGroup from "@/components/ui/form/InputGroup";
import InputField from "@/components/ui/form/InputField";

interface XpActionSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function XpActionSection({ formData, setFormData }: XpActionSectionProps) {
  const tAnimals = useTranslations("Animals");
  const tCommon = useTranslations("Common");

  const handleActionChange = (actionKey: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      actions: {
        ...prev?.actions,
        [actionKey]: {
          ...prev?.actions?.[actionKey],
          [field]: value === "" ? null : parseInt(value, 10),
        },
      },
    }));
  };

  const actions = [
    { key: "feed", label: tAnimals("actions.feed") || "Füttern", icon: "/images/icons/feed.png" },
    { key: "play", label: tAnimals("actions.play") || "Spielen", icon: "/images/icons/play.png" },
    {
      key: "clean",
      label: tAnimals("actions.clean") || "Ausmisten",
      icon: "/images/icons/clean.png",
    },
  ];

  return (
    <InfoAccordion
      title={tAnimals("xpSection.actionsXp") || "Aktionen & EP"}
      icon="/images/icons/star.png"
      defaultOpen={false}
    >
      <Styles.SectionColumn>
        {actions.map((action) => (
          <Styles.ActionRow key={action.key}>
            <Styles.Label>
              {action.icon && <Image src={action.icon} alt="" width="20" height="20" />}
              <span>{action.label}</span>
            </Styles.Label>

            <Styles.InputsContainer>
              <Styles.FormGroup>
                <Styles.Label htmlFor={`${action.key}-xp`}>XP</Styles.Label>
                <InputGroup icon="/images/icons/star.png">
                  <InputField
                    id={`${action.key}-xp`}
                    type="number"
                    value={formData?.actions?.[action.key]?.xp ?? ""}
                    placeholder="0"
                    onChange={(e) => handleActionChange(action.key, "xp", e.target.value)}
                    $width="70px"
                  />
                </InputGroup>
              </Styles.FormGroup>

              <Styles.FormGroup>
                <Styles.Label htmlFor={`${action.key}-hours`}>
                  {tCommon("hours") || "Std."}
                </Styles.Label>
                <InputGroup unit="h">
                  <InputField
                    id={`${action.key}-hours`}
                    type="number"
                    value={formData?.actions?.[action.key]?.durationHours ?? ""}
                    onChange={(e) =>
                      handleActionChange(action.key, "durationHours", e.target.value)
                    }
                    $width="70px"
                    placeholder="0"
                  />
                </InputGroup>
              </Styles.FormGroup>

              <Styles.FormGroup>
                <Styles.Label htmlFor={`${action.key}-minutes`}>
                  {tCommon("minutes") || "Min."}
                </Styles.Label>
                <InputGroup unit="m">
                  <InputField
                    id={`${action.key}-minutes`}
                    type="number"
                    value={formData?.actions?.[action.key]?.durationMinutes ?? ""}
                    onChange={(e) =>
                      handleActionChange(action.key, "durationMinutes", e.target.value)
                    }
                    $width="70px"
                    placeholder="0"
                  />
                </InputGroup>
              </Styles.FormGroup>
            </Styles.InputsContainer>
          </Styles.ActionRow>
        ))}
      </Styles.SectionColumn>
    </InfoAccordion>
  );
}
