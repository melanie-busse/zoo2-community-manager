"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import CurrencyBadge, { CurrencyType } from "@/components/ui/badges/CurrencyBadge";
import { confirmDeleteDialog } from "@/utils/alerts";
import {
  createShopOnClient,
  updateShopOnClient,
  deleteShopOnClient,
} from "@/service/frontend/Region";

interface ShopLevel {
  id: number;
  shopId: number;
  level: number;
  cost: number;
  currency: string;
  maxCapacity: number;
  buildTime: string;
}

interface ShopWithLevels {
  id: number;
  regionId: number;
  name: string;
  coinsPerClient: number | null;
  levels: ShopLevel[];
}

interface ShopLevelInput {
  level: number;
  cost: string;
  currency: string;
  maxCapacity: string;
  buildTime: string;
}

interface RegionShopSectionProps {
  regionId: number;
  regionIdentifier: string;
  initialShops: ShopWithLevels[];
  isAdmin: boolean;
}

function toCurrencyType(currency: string): CurrencyType {
  return currency === "DIAMONDS" ? "Diamond" : "Zoodollar";
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ShopModalProps {
  mode: "create" | "edit";
  shop?: ShopWithLevels;
  regionId: number;
  onClose: () => void;
  onSaved: (shop: ShopWithLevels) => void;
}

function ShopModal({ mode, shop, regionId, onClose, onSaved }: ShopModalProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const [name, setName] = useState(shop?.name ?? "");
  const [coinsPerClient, setCoinsPerClient] = useState(
    shop?.coinsPerClient != null ? String(shop.coinsPerClient) : "",
  );
  const [levels, setLevels] = useState<ShopLevelInput[]>(() => {
    if (shop && shop.levels.length > 0) {
      return shop.levels.map((l) => ({
        level: l.level,
        cost: String(l.cost),
        currency: l.currency,
        maxCapacity: String(l.maxCapacity),
        buildTime: l.buildTime,
      }));
    }
    return [{ level: 0, cost: "", currency: "COINS", maxCapacity: "", buildTime: "" }];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLevel = () => {
    setLevels((prev) => [
      ...prev,
      { level: prev.length, cost: "", currency: "COINS", maxCapacity: "", buildTime: "" },
    ]);
  };

  const removeLevel = (idx: number) => {
    setLevels((prev) => prev.filter((_, i) => i !== idx).map((l, i) => ({ ...l, level: i })));
  };

  const updateLevel = (idx: number, field: keyof ShopLevelInput, value: string) => {
    setLevels((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      toast.warn(tRegion("shop_name") + " " + tCommon("required_hint", { defaultValue: "ist Pflichtfeld" }));
      return;
    }

    const levelData = levels.map((l) => ({
      level: l.level,
      cost: parseInt(l.cost) || 0,
      currency: l.currency,
      maxCapacity: parseInt(l.maxCapacity) || 0,
      buildTime: l.buildTime,
    }));

    const data = {
      name: name.trim(),
      coinsPerClient: coinsPerClient !== "" ? parseInt(coinsPerClient) : null,
      levels: levelData,
    };

    setIsSubmitting(true);
    try {
      let result: ShopWithLevels;
      if (mode === "edit" && shop) {
        result = await updateShopOnClient(regionId, shop.id, data);
      } else {
        result = await createShopOnClient(regionId, data);
      }
      onSaved(result);
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{mode === "edit" ? tRegion("edit_shop") : tRegion("add_shop")}</ModalTitle>
        <ModalForm onSubmit={handleSubmit}>
          <ModalGroup>
            <ModalLabel>{tRegion("shop_name")}</ModalLabel>
            <ModalInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </ModalGroup>

          <ModalGroup>
            <ModalLabel>{tRegion("coins_per_client")}</ModalLabel>
            <ModalInput
              type="number"
              value={coinsPerClient}
              onChange={(e) => setCoinsPerClient(e.target.value)}
              min={0}
            />
          </ModalGroup>

          <LevelSection>
            <LevelSectionTitle>{tRegion("level_value", { level: "" }).replace(" ", "").trim() || "Level"}-Stufen</LevelSectionTitle>
            {levels.map((l, idx) => (
              <LevelRow key={idx}>
                <LevelNum>Lvl {l.level}</LevelNum>
                <ModalInput
                  type="number"
                  placeholder={tRegion("build_cost")}
                  value={l.cost}
                  onChange={(e) => updateLevel(idx, "cost", e.target.value)}
                  min={0}
                  style={{ flex: 1 }}
                />
                <CurrencySelect
                  value={l.currency}
                  onChange={(e) => updateLevel(idx, "currency", e.target.value)}
                >
                  <option value="COINS">{tCommon("currencies.zoodollar")}</option>
                  <option value="DIAMONDS">{tCommon("currencies.diamonds")}</option>
                </CurrencySelect>
                <ModalInput
                  type="number"
                  placeholder={tRegion("max_capacity")}
                  value={l.maxCapacity}
                  onChange={(e) => updateLevel(idx, "maxCapacity", e.target.value)}
                  min={0}
                  style={{ flex: 1 }}
                />
                <ModalInput
                  type="text"
                  placeholder={tRegion("build_time_label")}
                  value={l.buildTime}
                  onChange={(e) => updateLevel(idx, "buildTime", e.target.value)}
                  style={{ flex: 1 }}
                />
                {levels.length > 1 && (
                  <RemoveBtn type="button" onClick={() => removeLevel(idx)}>×</RemoveBtn>
                )}
              </LevelRow>
            ))}
            <AddLevelBtn type="button" onClick={addLevel}>+ Level</AddLevelBtn>
          </LevelSection>

          <ModalActions>
            <CancelBtn type="button" onClick={onClose}>{tCommon("messages.cancel")}</CancelBtn>
            <SaveBtn type="submit" disabled={isSubmitting}>
              {isSubmitting ? tCommon("saving") : tRegion("save_shop")}
            </SaveBtn>
          </ModalActions>
        </ModalForm>
      </ModalCard>
    </ModalOverlay>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; shop: ShopWithLevels }
  | null;

export default function RegionShopSection({
  regionId,
  regionIdentifier,
  initialShops,
  isAdmin,
}: RegionShopSectionProps) {
  const tRegion = useTranslations("region");
  const tCommon = useTranslations("common");

  const [shops, setShops] = useState<ShopWithLevels[]>(initialShops);
  const [modalState, setModalState] = useState<ModalState>(null);

  const handleDelete = async (shop: ShopWithLevels) => {
    const confirmed = await confirmDeleteDialog({
      title: tRegion("delete_shop_confirm"),
      text: shop.name,
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });
    if (!confirmed) return;
    try {
      await deleteShopOnClient(regionId, shop.id);
      setShops((prev) => prev.filter((s) => s.id !== shop.id));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleSaved = (saved: ShopWithLevels) => {
    setShops((prev) => {
      const exists = prev.find((s) => s.id === saved.id);
      if (exists) return prev.map((s) => (s.id === saved.id ? saved : s));
      return [...prev, saved];
    });
  };

  const identifier = regionIdentifier.toLowerCase();

  return (
    <>
      <InfoAccordion title={tRegion("shops")} icon="/images/icons/buildings.png" defaultOpen={false}>
        {isAdmin && (
          <AddShopBtn onClick={() => setModalState({ mode: "create" })}>
            + {tRegion("add_shop")}
          </AddShopBtn>
        )}

        <ShopList>
          {shops.map((shop) => (
            <ShopCard key={shop.id}>
              <ShopImageWrapper>
                <img
                  src={`/images/regions/${identifier}/shops/${shop.name}/image.jpg`}
                  alt={shop.name}
                  width={180}
                  height={120}
                  style={{ objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </ShopImageWrapper>

              <ShopInfo>
                <ShopName>{shop.name}</ShopName>
                {shop.coinsPerClient != null && (
                  <CoinsLine>
                    {shop.coinsPerClient} {tRegion("coins_per_client")}
                  </CoinsLine>
                )}

                {shop.levels.length > 0 && (
                  <LevelTable>
                    <thead>
                      <tr>
                        <LevelTh style={{ textAlign: "left" }}>Level</LevelTh>
                        <LevelTh>{tRegion("build_cost")}</LevelTh>
                        <LevelTh>{tRegion("max_capacity")}</LevelTh>
                        <LevelTh>{tRegion("build_time_label")}</LevelTh>
                      </tr>
                    </thead>
                    <tbody>
                      {shop.levels.map((lvl) => (
                        <tr key={lvl.id}>
                          <LevelTd style={{ textAlign: "left", fontWeight: 600 }}>
                            {lvl.level}
                          </LevelTd>
                          <LevelTd>
                            <CurrencyBadge value={lvl.cost} type={toCurrencyType(lvl.currency)} />
                          </LevelTd>
                          <LevelTd>{lvl.maxCapacity}</LevelTd>
                          <LevelTd>{lvl.buildTime}</LevelTd>
                        </tr>
                      ))}
                    </tbody>
                  </LevelTable>
                )}

                {isAdmin && (
                  <AdminActions>
                    <ActionBtn onClick={() => setModalState({ mode: "edit", shop })}>
                      ✎
                    </ActionBtn>
                    <ActionBtn $danger onClick={() => handleDelete(shop)}>
                      ✕
                    </ActionBtn>
                  </AdminActions>
                )}
              </ShopInfo>
            </ShopCard>
          ))}
        </ShopList>
      </InfoAccordion>

      {modalState && (
        <ShopModal
          mode={modalState.mode}
          shop={modalState.mode === "edit" ? modalState.shop : undefined}
          regionId={regionId}
          onClose={() => setModalState(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const AddShopBtn = styled.button`
  margin-bottom: 16px;
  padding: 6px 14px;
  background: #5d7a2a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;

  &:hover {
    background: #4a6221;
  }
`;

const ShopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ShopCard = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
  background: #f9fbf5;
  border: 1px solid #e8f0d8;
  border-radius: 10px;
  padding: 12px;
`;

const ShopImageWrapper = styled.div`
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: #f0f0f0;
  min-width: 180px;
  min-height: 120px;
`;

const ShopInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ShopName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #2d5a27;
`;

const CoinsLine = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const LevelTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  margin-top: 6px;
`;

const LevelTh = styled.th`
  text-align: right;
  color: #888;
  padding-bottom: 4px;
  font-weight: normal;
  padding: 4px 8px;
`;

const LevelTd = styled.td`
  text-align: right;
  padding: 4px 8px;
  border-top: 1px solid #f0f0f0;
  color: #333;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  padding: 4px 10px;
  border: 1px solid ${({ $danger }) => ($danger ? "#e05252" : "#aac46a")};
  background: transparent;
  color: ${({ $danger }) => ($danger ? "#e05252" : "#5d7a2a")};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fdeaea" : "#f0f7e0")};
  }
`;

// ─── Modal Styled Components ──────────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 28px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 1.1rem;
  color: #2d5a27;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ModalGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ModalInput = styled.input`
  padding: 7px 10px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: #7aad33;
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LevelSectionTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const LevelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LevelNum = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #5d7a2a;
  white-space: nowrap;
  min-width: 36px;
`;

const CurrencySelect = styled.select`
  padding: 7px 6px;
  border: 1px solid #d0dcc0;
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
`;

const RemoveBtn = styled.button`
  padding: 4px 8px;
  border: 1px solid #e05252;
  background: transparent;
  color: #e05252;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #fdeaea;
  }
`;

const AddLevelBtn = styled.button`
  align-self: flex-start;
  padding: 5px 12px;
  border: 1px dashed #aac46a;
  background: transparent;
  color: #5d7a2a;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;

  &:hover {
    background: #f0f7e0;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  padding: 8px 18px;
  border: 1px solid #ccc;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const SaveBtn = styled.button`
  padding: 8px 18px;
  background: #5d7a2a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    background: #4a6221;
  }
`;
