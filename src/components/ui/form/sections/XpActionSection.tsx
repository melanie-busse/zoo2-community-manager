"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputGroup from "@/components/ui/form/InputGroup";
import InputField from "@/components/ui/form/InputField";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import ActionRow from "@/components/ui/form/styling/ActionRow";
import Label from "@/components/ui/form/Label";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import InputContainer from "../styling/InputContainer";

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
      <SectionColumn>
        {actions.map((action) => (
          <ActionRow key={action.key}>
            <Label>
              {action.icon && <Image src={action.icon} alt="" width="20" height="20" />}
              <span>{action.label}</span>
            </Label>

            <InputContainer>
              <FormGroup>
                <Label htmlFor={`${action.key}-xp`}>XP</Label>
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
              </FormGroup>

              <FormGroup>
                <Label htmlFor={`${action.key}-hours`}>{tCommon("hours") || "Std."}</Label>
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
              </FormGroup>

              <FormGroup>
                <Label htmlFor={`${action.key}-minutes`}>{tCommon("minutes") || "Min."}</Label>
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
              </FormGroup>
            </InputContainer>
          </ActionRow>
        ))}
      </SectionColumn>
    </InfoAccordion>
  );
}
