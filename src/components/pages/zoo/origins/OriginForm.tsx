"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { createOriginOnClient, updateOriginOnClient } from "@/service/frontend/Origin";
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
        <SectionColumn>
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
        </SectionColumn>
      </InfoAccordion>
      <InfoAccordion title={t("form.translations")} icon="/images/icons/info.png" defaultOpen>
            <SectionColumn>
              {texts.map((tx) => {
                const lang = languages.find((l) => l.code === tx.languageCode);
                return (
                  <React.Fragment key={tx.languageCode}>
                    <FormGroup>
                      <Label htmlFor={`name-${tx.languageCode}`}>
                        {t("name")} ({lang?.name ?? tx.languageCode})
                      </Label>
                      <InputField
                        id={`name-${tx.languageCode}`}
                        type="text"
                        value={tx.originName}
                        onChange={(e) => updateText(tx.languageCode, "originName", e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={`desc-${tx.languageCode}`}>
                        {t("form.description")} ({lang?.name ?? tx.languageCode})
                      </Label>
                      <InputField
                        id={`desc-${tx.languageCode}`}
                        type="text"
                        value={tx.originDescription}
                        onChange={(e) =>
                          updateText(tx.languageCode, "originDescription", e.target.value)
                        }
                      />
                    </FormGroup>
                  </React.Fragment>
                );
              })}
            </SectionColumn>
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
