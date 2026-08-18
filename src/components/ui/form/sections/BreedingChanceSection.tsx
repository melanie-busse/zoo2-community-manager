"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import InfoAccordion from "@/components/page-structure/Elements/InfoAccordion";
import InputGroup from "@/components/ui/form/InputGroup";
import InputField from "@/components/ui/form/InputField";
import SectionColumn from "@/components/ui/form/styling/SectionColumn";
import FormGroup from "@/components/ui/form/styling/FormGroup";
import Label from "@/components/ui/form/Label";

interface BreedingChanceSectionProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function BreedingChanceSection({ formData, setFormData }: BreedingChanceSectionProps) {
  const tSpecialCoat = useTranslations("specialCoat");

  const handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev: any) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleNumberChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      [key]: val !== "" ? parseFloat(val) : null,
    }));
  };

  return (
    <InfoAccordion
      title={tSpecialCoat("breeding.title") || "Zucht-Wahrscheinlichkeit"}
      icon="/images/icons/breeding.png"
      defaultOpen={true}
    >
      <SectionColumn>
        <CheckboxGroup>
          <StyledCheckbox
            type="checkbox"
            id="isContestSpecialCoat"
            name="isContestSpecialCoat"
            checked={Boolean(formData?.isContestSpecialCoat)}
            onChange={handleCheckboxChange("isContestSpecialCoat")}
          />
          <CheckboxLabel htmlFor="isContestSpecialCoat">
            {tSpecialCoat("breeding.isContestSpecialCoat")}
          </CheckboxLabel>
        </CheckboxGroup>

        <CheckboxGroup>
          <StyledCheckbox
            type="checkbox"
            id="parentWithCoatNeeded"
            name="parentWithCoatNeeded"
            checked={Boolean(formData?.parentWithCoatNeeded)}
            onChange={handleCheckboxChange("parentWithCoatNeeded")}
          />
          <CheckboxLabel htmlFor="parentWithCoatNeeded">
            {tSpecialCoat("breeding.parentWithCoatNeeded")}
          </CheckboxLabel>
        </CheckboxGroup>

        <SubGrid>
          <ChanceBlock>
            <BlockTitle>Basischance</BlockTitle>
            <FormGroup>
              <Label htmlFor="chanceBaseWithoutParent">ohne Elternteil</Label>
              <InputGroup unit="%">
                <InputField
                  id="chanceBaseWithoutParent"
                  name="chanceBaseWithoutParent"
                  type="number"
                  step="0.1"
                  value={formData?.chanceBaseWithoutParent ?? ""}
                  onChange={handleNumberChange("chanceBaseWithoutParent")}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="chanceBaseWithOneParent">mit Elternteil</Label>
              <InputGroup unit="%">
                <InputField
                  id="chanceBaseWithOneParent"
                  name="chanceBaseWithOneParent"
                  type="number"
                  step="0.1"
                  value={formData?.chanceBaseWithOneParent ?? ""}
                  onChange={handleNumberChange("chanceBaseWithOneParent")}
                />
              </InputGroup>
            </FormGroup>
          </ChanceBlock>

          <ChanceBlock>
            <BlockTitle>Eventchance</BlockTitle>
            <FormGroup>
              <Label htmlFor="chanceEventWithoutParent">ohne Elternteil</Label>
              <InputGroup unit="%">
                <InputField
                  id="chanceEventWithoutParent"
                  name="chanceEventWithoutParent"
                  type="number"
                  step="0.1"
                  value={formData?.chanceEventWithoutParent ?? ""}
                  onChange={handleNumberChange("chanceEventWithoutParent")}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="chanceEventWithOneParent">mit Elternteil</Label>
              <InputGroup unit="%">
                <InputField
                  id="chanceEventWithOneParent"
                  name="chanceEventWithOneParent"
                  type="number"
                  step="0.1"
                  value={formData?.chanceEventWithOneParent ?? ""}
                  onChange={handleNumberChange("chanceEventWithOneParent")}
                />
              </InputGroup>
            </FormGroup>
          </ChanceBlock>
        </SubGrid>
      </SectionColumn>
    </InfoAccordion>
  );
}

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-top: 10px;

  @media (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChanceBlock = styled.div`
  background: #f9fbf9;
  border: 1px solid #e8f0e8;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BlockTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  color: #2d5a27;
  border-bottom: 1px solid #e0eae0;
  padding-bottom: 4px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
`;

const CheckboxLabel = styled(Label)`
  margin: 0;
  cursor: pointer;
  white-space: nowrap;
`;
