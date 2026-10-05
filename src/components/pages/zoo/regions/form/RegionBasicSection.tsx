"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DatePickerField from "@/components/ui/form/DatePickerField";
import InputField from "@/components/ui/form/InputField";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";

interface RegionBasicSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function RegionBasicSection({ formData, setFormData }: RegionBasicSectionProps) {
  const tRegion = useTranslations("region");

  return (
    <InfoAccordion
      title={tRegion("form.basic_info")}
      icon="/images/icons/info.png"
      defaultOpen={true}
    >
      <SectionColumn>
        <FormGroup>
          <Label htmlFor="identifier">{tRegion("form.identifier")}</Label>
          <input
            id="identifier"
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, identifier: e.target.value }))
            }
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              width: "100%",
            }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="releasedate">{tRegion("form.releasedate")}</Label>
          <DatePickerField
            id="releasedate"
            value={formData.releasedate}
            onChange={(dateString: string | null) =>
              setFormData((prev: any) => ({ ...prev, releasedate: dateString ?? "" }))
            }
            $width="200px"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="unlocklevel">{tRegion("form.unlocklevel")}</Label>
          <InputField
            id="unlocklevel"
            type="number"
            value={formData.unlocklevel ?? ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, unlocklevel: e.target.value }))
            }
          />
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
