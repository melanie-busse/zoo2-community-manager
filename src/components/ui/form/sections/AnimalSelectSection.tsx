import React, { useState, useEffect } from "react";
import Label from "@/components/ui/form/Label";

interface AnimalSelectProps {
  animalsData: any[];
  formData: any;
  setFormData: (data: any) => void;
}

export default function AnimalSelectSection({
  animalsData,
  formData,
  setFormData,
}: AnimalSelectProps) {
  // Lokaler State für den Text, den der Nutzer im Suchfeld sieht
  const [inputValue, setInputValue] = useState("");

  // Synchronisieren, falls wir im Edit-Modus sind und schon eine animalId existiert
  useEffect(() => {
    if (formData.animalId) {
      const selectedAnimal = animalsData.find((a) => a.id === formData.animalId);
      if (selectedAnimal) {
        setInputValue(selectedAnimal.animaltext?.[0]?.animalName || selectedAnimal.identifier);
      }
    } else {
      setInputValue("");
    }
  }, [formData.animalId, animalsData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Suchen, ob der eingetippte Text exakt zu einem Tiernamen passt
    const foundAnimal = animalsData.find((animal) => {
      const name = animal.animaltext?.[0]?.animalName || animal.identifier;
      return name.toLowerCase() === value.toLowerCase();
    });

    // Wenn exakt getroffen, ID setzen, ansonsten leeren (Pflichtfeld-Schutz)
    setFormData({
      ...formData,
      animalId: foundAnimal ? foundAnimal.id : null,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Label htmlFor="animalSearch">Tier auswählen *</Label>

      {/* Das durchsuchbare Input-Feld */}
      <input
        id="animalSearch"
        type="text"
        list="animalsDatalist" // Verknüpfung zur Datalist unten
        placeholder="Tippen zum Suchen (z.B. Löwe)..."
        value={inputValue}
        onChange={handleInputChange}
        autoComplete="off"
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #e0ecd0",
          backgroundColor: "#fff",
        }}
      />

      {/* Die unsichtbare Liste, die Next.js/der Browser zum Filtern nutzt */}
      <datalist id="animalsDatalist">
        {animalsData.map((animal) => (
          <option key={animal.id} value={animal.animaltext?.[0]?.animalName || animal.identifier} />
        ))}
      </datalist>

      {/* Kleiner visueller Indikator für den Admin */}
      {formData.animalId && (
        <span style={{ fontSize: "12px", color: "#6b8e23" }}>
          ✓ Tier erkannt (ID: {formData.animalId})
        </span>
      )}
    </div>
  );
}
