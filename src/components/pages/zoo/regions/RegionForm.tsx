"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { mapRegionToForm } from "@/utils/RegionUtil";
import { createRegionOnClient, updateRegionOnClient } from "@/service/frontend/Region";

import RegionBasicSection from "./form/RegionBasicSection";
import RegionPriceSection from "./form/RegionPriceSection";
import RegionTranslationSection from "./form/RegionTranslationSection";
import RegionBreedingCenterSection from "./form/RegionBreedingCenterSection";
import RegionAdmissionsBoothSection from "./form/RegionAdmissionsBoothSection";
import RegionBuildingField from "./form/RegionBuildingField";
import RegionGuestLoungeSection from "./form/RegionGuestLoungeSection";
import SubmitButton from "@/components/ui/form/SubmitButton";
import FormGrid from "@/components/ui/form/styling/FormGrid";
import Column from "@/components/ui/form/styling/Column";

interface RegionFormProps {
  region?: any;
  languages: Array<{ code: string; name: string }>;
}

const STAFF_ROOM_REGIONS = new Set(["Aviary", "Aquarium", "Terrarium", "NocturnalHouse"]);

export default function RegionForm({ region, languages }: RegionFormProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [formData, setFormData] = useState<any>(() =>
    mapRegionToForm(region ?? null, languages),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminBuildingTitle = STAFF_ROOM_REGIONS.has(formData.identifier)
    ? tRegion("admin_building_room")
    : tRegion("admin_building");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.identifier.trim()) {
      toast.warn(tRegion("form.messages.requiredIdentifier"));
      return;
    }

    setIsSubmitting(true);
    try {
      let result: any;
      if (formData.id) {
        result = await updateRegionOnClient(formData.id, formData);
      } else {
        result = await createRegionOnClient(formData);
      }

      toast.success(
        formData.id ? tRegion("form.messages.editSuccess") : tRegion("form.messages.createSuccess"),
      );
      router.push(`/zoo/regions/${result.id}`);
    } catch (e: any) {
      if (e.data?.error === "MayorReadonly") {
        toast.info(e.data.message);
        return;
      }
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGrid>
        <Column>
          <RegionBasicSection formData={formData} setFormData={setFormData} />
          <RegionPriceSection formData={formData} setFormData={setFormData} />
          <RegionTranslationSection
            formData={formData}
            setFormData={setFormData}
            dbLanguages={languages}
          />
        </Column>
        <Column>
          <RegionBreedingCenterSection formData={formData} setFormData={setFormData} defaultOpen={!formData.id} />
          <RegionAdmissionsBoothSection formData={formData} setFormData={setFormData} defaultOpen={!formData.id} />
          <RegionBuildingField
            formKey="adminBuilding"
            title={adminBuildingTitle}
            icon="/images/icons/directional_sign.png"
            formData={formData}
            setFormData={setFormData}
          />
          <RegionBuildingField
            formKey="visitorCenter"
            title={tRegion("visitor_center")}
            icon="/images/icons/visitors.jpg"
            formData={formData}
            setFormData={setFormData}
          />
          <RegionBuildingField
            formKey="transportStation"
            title={tRegion("transport_station")}
            icon="/images/icons/directional_sign.png"
            formData={formData}
            setFormData={setFormData}
          />
          <RegionGuestLoungeSection formData={formData} setFormData={setFormData} />
        </Column>
      </FormGrid>
      <SubmitButton
        label={isSubmitting ? tCommon("saving") : tRegion("form.save_region")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
