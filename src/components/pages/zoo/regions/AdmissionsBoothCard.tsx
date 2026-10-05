"use client";

import React from "react";
import styled from "styled-components";
import NextImage from "next/image";
import { useTranslations } from "next-intl";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import * as Styles from "@/components/pages/animals/AnimalDetails/AnimalDetails.styles";

function toCurrencyType(pricetype: number): CurrencyType {
  return pricetype === 2 ? "Diamond" : "Zoodollar";
}

interface AdmissionsBooth {
  id: number;
  booth_level: number;
  max_capacity: number;
  upgrade: number;
  pricetype: number;
}

interface AdmissionsBoothCardProps {
  booths: AdmissionsBooth[];
}

export default function AdmissionsBoothCard({ booths }: AdmissionsBoothCardProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  return (
    <InfoAccordion title={tRegion("admissions_booth")} icon="/images/icons/star.png" defaultOpen={true}>
      <TopRow>
        <ImageWrapper>
          <NextImage
            src="/images/placeholder.jpg"
            alt={tRegion("admissions_booth")}
            width={240}
            height={160}
            style={{ objectFit: "cover", display: "block" }}
          />
        </ImageWrapper>
      </TopRow>

      {booths.length > 0 && (
        <Styles.XpTable style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>{tRegion("booth_level")}</th>
              <th style={{ textAlign: "right" }}>{tRegion("max_capacity")}</th>
              <th style={{ textAlign: "right" }}>{tRegion("upgrade")}</th>
            </tr>
          </thead>
          <tbody>
            {booths.map((b) => (
              <tr key={b.id}>
                <Styles.TableCell style={{ textAlign: "left", fontWeight: "normal", color: "#333" }}>
                  {b.booth_level}
                </Styles.TableCell>
                <Styles.TableCell>{b.max_capacity.toLocaleString()}</Styles.TableCell>
                <Styles.TableCell>
                  {b.upgrade > 0 ? (
                    <CurrencyBadge value={b.upgrade} type={toCurrencyType(b.pricetype)} />
                  ) : (
                    "—"
                  )}
                </Styles.TableCell>
              </tr>
            ))}
          </tbody>
        </Styles.XpTable>
      )}
    </InfoAccordion>
  );
}

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;
