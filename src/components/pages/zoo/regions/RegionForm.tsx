"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "react-toastify";

import { mapRegionToForm } from "@/utils/RegionUtil";
import { createRegionOnClient, updateRegionOnClient } from "@/service/frontend/Region";

import RegionBasicSection from "./form/RegionBasicSection";
import RegionTranslationSection from "./form/RegionTranslationSection";
import RegionBreedingCenterSection from "./form/RegionBreedingCenterSection";
import RegionAdmissionsBoothSection from "./form/RegionAdmissionsBoothSection";
import RegionBuildingField from "./form/RegionBuildingField";
import RegionGuestLoungeSection from "./form/RegionGuestLoungeSection";
import SubmitButton from "@/components/ui/form/SubmitButton";
import FormGrid from "@/components/ui/form/styling/FormGrid";
import Column from "@/components/ui/form/styling/Column";
import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import OriginTransfer from "@/components/ui/OriginTransfer/OriginTransfer";

interface Terrain {
  id: number;
  identifier: string;
  terrainTexts: { name: string }[];
}

interface Shop {
  id: number;
  name: string;
  regionId: number | null;
}

interface RegionFormProps {
  region?: any;
  languages: Array<{ code: string; name: string }>;
  terrains: Terrain[];
  allShops: Shop[];
}

const STAFF_ROOM_REGIONS = new Set(["Aviary", "Aquarium", "Terrarium", "NocturnalHouse"]);

export default function RegionForm({ region, languages, terrains, allShops }: RegionFormProps) {
  const tRegion = useTranslations("region");
  const tShop = useTranslations("shop");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [formData, setFormData] = useState<any>(() => mapRegionToForm(region ?? null, languages));
  const [shopIds, setShopIds] = useState<number[]>(
    () => (region?.shops ?? []).map((s: Shop) => s.id),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminBuildingTitle = STAFF_ROOM_REGIONS.has(formData.identifier)
    ? tRegion("admin_building_room")
    : tRegion("admin_building");

  const shopItems = allShops.map((s) => ({
    id: s.id,
    name: s.name,
  }));

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
      const payload = { ...formData, shopIds };
      if (formData.id) {
        result = await updateRegionOnClient(formData.id, payload);
      } else {
        result = await createRegionOnClient(payload);
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
          <RegionBasicSection formData={formData} setFormData={setFormData} terrains={terrains} />
          <RegionTranslationSection
            formData={formData}
            setFormData={setFormData}
            dbLanguages={languages}
          />
        </Column>
        <Column>
          <RegionBreedingCenterSection
            formData={formData}
            setFormData={setFormData}
            defaultOpen={!formData.id}
          />
          <RegionAdmissionsBoothSection
            formData={formData}
            setFormData={setFormData}
            defaultOpen={!formData.id}
          />
          <RegionBuildingField
            formKey="adminBuilding"
            title={adminBuildingTitle}
            icon="/images/icons/buildings.png"
            formData={formData}
            setFormData={setFormData}
          />
          <RegionBuildingField
            formKey="visitorCenter"
            title={tRegion("visitor_center")}
            icon="/images/icons/buildings.png"
            formData={formData}
            setFormData={setFormData}
          />
          <RegionBuildingField
            formKey="transportStation"
            title={tRegion("transport_station")}
            icon="/images/icons/buildings.png"
            formData={formData}
            setFormData={setFormData}
          />
          <RegionGuestLoungeSection formData={formData} setFormData={setFormData} />
        </Column>
        <Column $fullWidth>
          <InfoAccordion title={tShop("overview_title")} icon="/images/icons/buildings.png" defaultOpen>
            <OriginTransfer
              allOrigins={shopItems}
              selectedIds={shopIds}
              onChange={setShopIds}
            />
          </InfoAccordion>
        </Column>
      </FormGrid>
      <SubmitButton
        label={isSubmitting ? tCommon("saving") : tRegion("form.save_region")}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
