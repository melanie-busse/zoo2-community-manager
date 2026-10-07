"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import DatePickerField from "@/components/ui/form/DatePickerField";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import FormRow from "@/components/ui/form/styling/FormRow";
import Label from "@/components/ui/form/Label";

interface Terrain {
  id: number;
  identifier: string;
  terrainTexts: { name: string }[];
}

interface RegionBasicSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  terrains: Terrain[];
}

export default function RegionBasicSection({ formData, setFormData, terrains }: RegionBasicSectionProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const currencyOptions = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  const terrainOptions = [
    { value: "0", label: "-" },
    ...terrains.map((t) => ({
      value: String(t.id),
      label: t.terrainTexts[0]?.name ?? t.identifier,
    })),
  ];

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
          <Label htmlFor="terrainid">{tRegion("form.terrain")}</Label>
          <Selectbox
            id="terrainid"
            name="terrainid"
            value={formData.terrainid?.toString() ?? "0"}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, terrainid: e.target.value }))
            }
            options={terrainOptions}
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

        <FormGroup>
          <Label htmlFor="price">{tCommon("price")}</Label>
          <FormRow>
            <InputField
              id="price"
              type="number"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, price: e.target.value }))
              }
            />
            <Selectbox
              id="priceTypeId"
              name="priceTypeId"
              value={formData.priceTypeId?.toString() ?? "1"}
              onChange={(e) =>
                setFormData((prev: any) => ({ ...prev, priceTypeId: e.target.value }))
              }
              options={currencyOptions}
            />
          </FormRow>
        </FormGroup>
      </SectionColumn>
    </InfoAccordion>
  );
}
