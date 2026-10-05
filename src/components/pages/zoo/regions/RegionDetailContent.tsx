"use client";

import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import RegionHeaderCard from "./RegionHeaderCard";
import BreedingCenterCard from "./BreedingCenterCard";
import AdmissionsBoothCard from "./AdmissionsBoothCard";
import BuildingCard from "./BuildingCard";

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
  const id = region.identifier.toLowerCase();
  const hasGuestLounge = region.guestLounges.length > 0;

  const STAFF_ROOM_REGIONS = new Set(["Aviary", "Aquarium", "Terrarium", "NocturnalHouse"]);
  const adminBuildingTitle = STAFF_ROOM_REGIONS.has(region.identifier)
    ? tRegion("admin_building_room")
    : tRegion("admin_building");

  return (
    <Wrapper>
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
