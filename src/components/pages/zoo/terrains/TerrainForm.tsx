"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import styled from "styled-components";
import { createTerrainOnClient, updateTerrainOnClient } from "@/service/frontend/Terrain";
import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Label from "@/components/ui/form/Label";
import SubmitButton from "@/components/ui/form/SubmitButton";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";

interface Language {
  code: string;
  name: string;
}

interface TerrainFormProps {
  terrain?: {
    id: number;
    identifier: string;
    terrainTexts: { languageCode: string; name: string }[];
  };
  languages: Language[];
}

export default function TerrainForm({ terrain, languages }: TerrainFormProps) {
  const t = useTranslations("terrain");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [identifier, setIdentifier] = useState(terrain?.identifier ?? "");
  const [terrainTexts, setTerrainTexts] = useState<{ languageCode: string; name: string }[]>(() => {
    const textMap = new Map(terrain?.terrainTexts.map((tt) => [tt.languageCode, tt.name]) ?? []);
    return languages.map((l) => ({ languageCode: l.code, name: textMap.get(l.code) ?? "" }));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateText = (code: string, name: string) => {
    setTerrainTexts((prev) => prev.map((t) => (t.languageCode === code ? { ...t, name } : t)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!identifier.trim()) {
      toast.warn(t("form.messages.requiredIdentifier"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = { identifier, terrainTexts };
      if (terrain?.id) {
        await updateTerrainOnClient(terrain.id, data);
      } else {
        await createTerrainOnClient(data);
      }
      toast.success(terrain?.id ? t("form.messages.editSuccess") : t("form.messages.createSuccess"));
      router.push("/zoo/terrains");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InfoAccordion title={t("form.basic_info")} icon="/images/icons/info.png" defaultOpen>
        <SectionColumn>
          <FormGroup>
            <Label htmlFor="identifier">{t("identifier")}</Label>
            <InputField
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </FormGroup>
        </SectionColumn>
      </InfoAccordion>

      <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
        <SectionColumn>
          {terrainTexts.map((tt) => {
            const lang = languages.find((l) => l.code === tt.languageCode);
            return (
              <FormGroup key={tt.languageCode}>
                <Label htmlFor={`name-${tt.languageCode}`}>{lang?.name ?? tt.languageCode}</Label>
                <InputField
                  id={`name-${tt.languageCode}`}
                  type="text"
                  value={tt.name}
                  onChange={(e) => updateText(tt.languageCode, e.target.value)}
                />
              </FormGroup>
            );
          })}
        </SectionColumn>
      </InfoAccordion>

      <SubmitButton
        label={isSubmitting ? tCommon("saving") : t("form.save_terrain")}
        isSubmitting={isSubmitting}
      />
    </Form>
  );
}

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;
