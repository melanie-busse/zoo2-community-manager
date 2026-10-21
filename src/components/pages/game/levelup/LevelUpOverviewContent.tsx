"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { useLevelStore } from "@/store/useLevelStore";
import type { LevelRewardItem } from "@/service/LevelService";
import Table from "@/components/page-structure/Table/Table";
import * as Styles from "@/components/page-structure/Table/Table.styles";
import FilterCard, { FilterRow } from "@/components/elements/Filter/FilterCard";
import { SearchInputField } from "@/components/elements/Filter/SearchInputField";
import ResultsInfo from "@/components/elements/Filter/ResultInfo";
import LevelUpPagination from "./LevelUpPagination";

interface LevelUpOverviewContentProps {
  levels: LevelRewardItem[];
  allAnimals: { id: number; name: string; identifier: string }[];
}

export default function LevelUpOverviewContent({
  levels,
  allAnimals,
}: LevelUpOverviewContentProps) {
  const t = useTranslations("levelup");

  const setInitialLevels = useLevelStore((state) => state.setInitialLevels);
  const currentItems = useLevelStore((state) => state.currentItems);
  const filteredCount = useLevelStore((state) => state.filteredCount);
  const levelSearch = useLevelStore((state) => state.levelSearch);
  const animalId = useLevelStore((state) => state.animalId);
  const setLevelSearch = useLevelStore((state) => state.setLevelSearch);
  const setAnimalId = useLevelStore((state) => state.setAnimalId);

  useEffect(() => {
    setInitialLevels(levels);
  }, [levels, setInitialLevels]);

  return (
    <>
      <FilterCard>
        <FilterRow>
          <SearchInputField
            value={levelSearch}
            onChange={setLevelSearch}
            placeholder={t("search_placeholder")}
          />
          <AnimalSelect
            value={animalId ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setAnimalId(val === "" ? null : Number(val));
            }}
          >
            <option value="">{t("all_animals")}</option>
            {allAnimals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </AnimalSelect>
        </FilterRow>
      </FilterCard>

      <ResultsInfo currentCount={currentItems.length} totalCount={filteredCount} unit={t("unit")} />

      {currentItems.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>{t("col_level")}</th>
              <Styles.TableHeaderRight>{t("col_coins")}</Styles.TableHeaderRight>
              <Styles.TableHeaderRight>{t("col_diamonds")}</Styles.TableHeaderRight>
              <th>{t("col_zoo_items")}</th>
              <th>{t("col_enclosure_items")}</th>
              <th>{t("col_chests")}</th>
              <th>{t("col_animals")}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.level % 10 === 0 ? (
                    <strong>{item.level}</strong>
                  ) : (
                    item.level
                  )}
                </td>
                <Styles.TableCellRight>
                  {item.coins != null ? item.coins.toLocaleString() : "—"}
                </Styles.TableCellRight>
                <Styles.TableCellRight>
                  {item.diamonds != null ? item.diamonds : "—"}
                </Styles.TableCellRight>
                <td>{item.zooItems ?? "—"}</td>
                <td>
                  {item.enclosureItems.length > 0 ? (
                    <ItemList>
                      {item.enclosureItems.map((enc) => (
                        <ItemRow key={enc.id}>
                          {enc.imagePath ? (
                            enc.biomeLink ? (
                              <a href={enc.biomeLink} style={{ flexShrink: 0 }}>
                                <Image
                                  src={enc.imagePath}
                                  alt={enc.localizedName ?? enc.name}
                                  width={32}
                                  height={32}
                                  style={{ objectFit: "cover", borderRadius: 4, display: "block" }}
                                />
                              </a>
                            ) : (
                              <BiomeThumb>
                                <Image
                                  src={enc.imagePath}
                                  alt={enc.localizedName ?? enc.name}
                                  width={32}
                                  height={32}
                                  style={{ objectFit: "cover", borderRadius: 4 }}
                                />
                              </BiomeThumb>
                            )
                          ) : null}
                          <span>
                            {enc.quantity > 1 ? `${enc.quantity}x ` : ""}
                            {enc.localizedName ?? (enc.nameKey ? t(enc.nameKey as Parameters<typeof t>[0]) : enc.name)}
                          </span>
                        </ItemRow>
                      ))}
                    </ItemList>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {item.chests.length > 0 ? (
                    <ItemList>
                      {item.chests.map((chest) => (
                        <div key={chest.id}>
                          {chest.quantity}x {chest.chestType}
                        </div>
                      ))}
                    </ItemList>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {item.animalRewards.length > 0 ? (
                    <ItemList>
                      {item.animalRewards.map((ar) => (
                        <ItemRow key={ar.id}>
                          {ar.animal?.identifier && ar.animal?.biomeIdentifier ? (
                            <AnimalThumb>
                              <Image
                                src={`/images/animals/${ar.animal.biomeIdentifier}/${ar.animal.identifier}/image.jpg`}
                                alt={ar.name}
                                width={28}
                                height={28}
                                style={{ objectFit: "cover", borderRadius: 4 }}
                              />
                            </AnimalThumb>
                          ) : null}
                          <span>
                            {ar.quantity > 1 ? `${ar.quantity}x ` : ""}
                            {ar.animal?.animalName ?? ar.name}
                          </span>
                        </ItemRow>
                      ))}
                    </ItemList>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <LevelUpPagination />
    </>
  );
}

const AnimalSelect = styled.select`
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border: 2px solid rgba(224, 231, 213, 0.5);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[100]};
    box-shadow: 0 0 0 4px rgba(141, 189, 91, 0.1);
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BiomeThumb = styled.div`
  flex-shrink: 0;
`;

const AnimalThumb = styled.div`
  flex-shrink: 0;
`;
