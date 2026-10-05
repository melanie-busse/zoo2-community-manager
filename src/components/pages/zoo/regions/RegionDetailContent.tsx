"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import RegionHeaderCard from "./RegionHeaderCard";
import BreedingCenterCard from "./BreedingCenterCard";
import AdmissionsBoothCard from "./AdmissionsBoothCard";
import BuildingCard from "./BuildingCard";
import ActionGroupBadge from "@/components/ui/badges/ActionGroupBadge";
import { useRouter } from "@/i18n/routing";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { confirmDeleteDialog } from "@/utils/alerts";
import { deleteRegionOnClient } from "@/service/frontend/Region";

interface Building {
  price: number;
  pricetype: number;
}

interface BreedingCenterSlot {
  id: number;
  slot: number;
  price: number;
  pricetype: number;
}

interface AdmissionsBooth {
  id: number;
  booth_level: number;
  max_capacity: number;
  upgrade: number;
  pricetype: number;
}

interface Region {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  releasedate: Date;
  regionTexts: { name: string }[];
  priceType: { name: string } | null;
  breedingCenters: Building[];
  breedingCenterSlots: BreedingCenterSlot[];
  admissionsBooths: AdmissionsBooth[];
  adminBuildings: Building[];
  visitorCenters: Building[];
  transportStation: Building[];
  guestLounges: Building[];
}

interface RegionDetailContentProps {
  region: Region;
}

export default function RegionDetailContent({ region }: RegionDetailContentProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = hasMinimumRole(session, "Director") || isMayor(session);

  const id = region.identifier.toLowerCase();
  const hasGuestLounge = region.guestLounges.length > 0;

  const STAFF_ROOM_REGIONS = new Set(["Aviary", "Aquarium", "Terrarium", "NocturnalHouse"]);
  const adminBuildingTitle = STAFF_ROOM_REGIONS.has(region.identifier)
    ? tRegion("admin_building_room")
    : tRegion("admin_building");

  const handleDelete = async () => {
    const confirmed = await confirmDeleteDialog({
      title: tRegion("form.messages.deleteErrorTitle"),
      text: tRegion("form.messages.confirmDelete"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteRegionOnClient(region.id);
      toast.success(tRegion("form.messages.deleteSuccess"));
      router.push("/zoo/regions");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Wrapper>
      {isAdmin && (
        <TopBar>
          <ActionGroupBadge
            id={region.id}
            onEdit={() => router.push(`/zoo/regions/${region.id}/edit`)}
            onDelete={handleDelete}
          />
        </TopBar>
      )}
      <RegionHeaderCard region={region} />

      <CardsGrid>
        <BreedingCenterCard
          identifier={region.identifier}
          breedingCenter={region.breedingCenters[0]}
          slots={region.breedingCenterSlots}
        />
        <AdmissionsBoothCard booths={region.admissionsBooths} />
      </CardsGrid>

      <CardsGrid>
        <BuildingCard
          title={adminBuildingTitle}
          icon="/images/icons/directional_sign.png"
          imagePath={`/images/regions/${id}/adminbuilding/image.webp`}
          building={region.adminBuildings[0]}
        />
        <BuildingCard
          title={tRegion("visitor_center")}
          icon="/images/icons/visitors.jpg"
          imagePath={`/images/regions/${id}/visitorcenter/image.webp`}
          building={region.visitorCenters[0]}
        />
      </CardsGrid>

      <CardsGrid>
        <BuildingCard
          title={tRegion("transport_station")}
          icon="/images/icons/directional_sign.png"
          imagePath={`/images/regions/${id}/transportstation/image.webp`}
          building={region.transportStation[0]}
        />
        {hasGuestLounge && (
          <BuildingCard
            title={tRegion("guest_lounge")}
            icon="/images/icons/visitors.jpg"
            imagePath={`/images/regions/${id}/guestlounge/image.webp`}
            building={region.guestLounges[0]}
          />
        )}
      </CardsGrid>
    </Wrapper>
  );
}

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    margin-left: -16px;
    margin-right: -16px;
    width: calc(100% + 32px);
    padding-left: 8px;
    padding-right: 8px;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;
