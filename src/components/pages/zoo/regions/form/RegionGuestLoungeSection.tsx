"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputField from "@/components/ui/form/InputField";
import Selectbox from "@/components/ui/form/Selectbox";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";
import FormRow from "@/components/ui/form/styling/FormRow";

interface RegionGuestLoungeSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function RegionGuestLoungeSection({
  formData,
  setFormData,
}: RegionGuestLoungeSectionProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const CURRENCY_OPTIONS = [
    { value: "1", label: tCommon("currencies.zoodollar") },
    { value: "2", label: tCommon("currencies.diamonds") },
  ];

  return (
    <InfoAccordion
      title={tRegion("guest_lounge")}
      icon="/images/icons/buildings.png"
      defaultOpen={true}
    >
      <SectionColumn>
        <FormGroup>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={Boolean(formData.hasGuestLounge)}
              onChange={(e) =>
                setFormData((p: any) => ({ ...p, hasGuestLounge: e.target.checked }))
              }
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            {tRegion("guest_lounge")}
          </label>
        </FormGroup>

        <div
          style={{
            opacity: formData.hasGuestLounge ? 1 : 0.4,
            pointerEvents: formData.hasGuestLounge ? "auto" : "none",
          }}
        >
          <FormGroup>
            <Label htmlFor="guestLounge-price">{tCommon("price")}</Label>
            <FormRow>
              <InputField
                id="guestLounge-price"
                type="number"
                value={formData.guestLounge?.price ?? ""}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    guestLounge: { ...p.guestLounge, price: e.target.value },
                  }))
                }
              />
              <Selectbox
                id="guestLounge-pricetype"
                name="guestLounge-pricetype"
                value={formData.guestLounge?.pricetype?.toString() ?? "1"}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    guestLounge: { ...p.guestLounge, pricetype: e.target.value },
                  }))
                }
                options={CURRENCY_OPTIONS}
              />
            </FormRow>
          </FormGroup>
        </div>
      </SectionColumn>
    </InfoAccordion>
  );
}
