"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { createOriginOnClient, updateOriginOnClient } from "@/service/frontend/Origin";
import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import FormTextarea from "@/components/ui/form/Textarea";
import Label from "@/components/ui/form/Label";
import SubmitButton from "@/components/ui/form/SubmitButton";
import FormGroup from "@/components/ui/form/styling/FormGroup";

interface Language {
  code: string;
  name: string;
}

interface OriginDetail {
  id: number;
  identifier: string | null;
  origintext: { languageCode: string; originName: string; originDescription: string | null }[];
}

interface OriginFormProps {
  origin?: OriginDetail;
  languages: Language[];
}

export default function OriginForm({ origin, languages }: OriginFormProps) {
  const t = useTranslations("origin");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [identifier, setIdentifier] = useState(origin?.identifier ?? "");
  const [texts, setTexts] = useState<
    { languageCode: string; originName: string; originDescription: string }[]
  >(() => {
    const map = new Map(origin?.origintext.map((tx) => [tx.languageCode, tx]) ?? []);
    return languages.map((l) => ({
      languageCode: l.code,
      originName: map.get(l.code)?.originName ?? "",
      originDescription: map.get(l.code)?.originDescription ?? "",
    }));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateText = (code: string, field: "originName" | "originDescription", value: string) => {
    setTexts((prev) =>
      prev.map((tx) => (tx.languageCode === code ? { ...tx, [field]: value } : tx)),
    );
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
      const data = { identifier, texts };
      if (origin?.id) {
        await updateOriginOnClient(origin.id, data);
        toast.success(t("form.messages.editSuccess"));
      } else {
        await createOriginOnClient(data);
        toast.success(t("form.messages.createSuccess"));
      }
      router.push("/zoo/origins");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InfoAccordion title={t("form.basic_info")} icon="/images/icons/info.png" defaultOpen>
        <FormGroup>
          <Label htmlFor="identifier">{t("identifier")}</Label>
          <InputField
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={!!origin}
          />
        </FormGroup>
      </InfoAccordion>

      <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
        <TranslationsGrid>
          {texts.map((tx) => {
            const lang = languages.find((l) => l.code === tx.languageCode);
            const langLabel = lang?.name ?? tx.languageCode;
            return (
              <LangCard key={tx.languageCode}>
                <LangHeader>{langLabel}</LangHeader>
                <FormGroup>
                  <Label htmlFor={`name-${tx.languageCode}`}>{t("name")}</Label>
                  <InputField
                    id={`name-${tx.languageCode}`}
                    type="text"
                    value={tx.originName}
                    onChange={(e) => updateText(tx.languageCode, "originName", e.target.value)}
                  />
                </FormGroup>
                <FormTextarea
                  id={`desc-${tx.languageCode}`}
                  label={t("form.description")}
                  value={tx.originDescription}
                  onChange={(e) =>
                    updateText(tx.languageCode, "originDescription", e.target.value)
                  }
                />
              </LangCard>
            );
          })}
        </TranslationsGrid>
      </InfoAccordion>

      <SubmitButton
        label={
          isSubmitting
            ? tCommon("saving")
            : origin
              ? t("form.save_origin")
              : t("form.create_origin")
        }
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

const TranslationsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0;
`;

const LangCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f9fbf5;
  border: 1px solid #e8f0d8;
  border-radius: 8px;
  padding: 12px;
`;

const LangHeader = styled.div`
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #5d7a2a;
  letter-spacing: 0.05em;
`;
