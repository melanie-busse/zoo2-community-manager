"use client";

import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import styled from "styled-components";
import { useLocale } from "next-intl";

// Styles der Bibliothek importieren
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  id: string;
  value: string | null;
  onChange: (dateString: string | null) => void;
  $width?: string;
}

export default function DatePickerField({ id, value, onChange, $width }: DatePickerFieldProps) {
  const locale = useLocale(); // Liefert z.B. "de", "en", "fr", "es" etc.
  const [localeReady, setLocaleReady] = useState(false);

  // Dynamisches Laden der date-fns Sprachpakete
  useEffect(() => {
    const loadLocale = async () => {
      try {
        let dateFnsLocale;

        // Mapping für Spezialfälle wie "en" -> "en-US"
        if (locale === "en") {
          const mod = await import("date-fns/locale/en-US");
          dateFnsLocale = mod.enUS;
        } else {
          // Dynamischer Import für Standard-Sprachcodes (de, fr, es, it, etc.)
          const mod = await import(`date-fns/locale/${locale}`);
          dateFnsLocale = mod[locale as keyof typeof mod] || mod.default;
        }

        if (dateFnsLocale) {
          registerLocale(locale, dateFnsLocale);
        }
      } catch (error) {
        console.error(`Konnte das date-fns Locale für "${locale}" nicht laden:`, error);
      } finally {
        setLocaleReady(true);
      }
    };

    loadLocale();
  }, [locale]);

  const selectedDate = value ? new Date(value) : null;

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <Wrapper $width={$width}>
      <StyledDatePickerContainer>
        <DatePicker
          id={id}
          selected={selectedDate}
          onChange={handleDateChange}
          // Nutzen das dynamisch geladene Locale erst, wenn es bereit ist
          locale={localeReady ? locale : undefined}
          dateFormat={locale === "de" ? "dd.MM.yyyy" : "yyyy-MM-dd"}
          placeholderText={locale === "de" ? "tt.mm.jjjj" : "yyyy-mm-dd"}
          isClearable
        />
      </StyledDatePickerContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $width?: string }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.$width || "100%"};
`;

// Hier stylen wir das Input-Feld *innerhalb* des Datepickers exakt wie dein originales InputField
const StyledDatePickerContainer = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1e2a5;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: inherit;
    background-color: #fdfdfd;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #88a04d;
      background-color: #fff;
      box-shadow: 0 0 0 2px rgba(136, 160, 77, 0.1);
    }
  }

  /* Optional: Hier könntest du noch den Kalender-Kasten farblich an dein grünes Zoo-Thema anpassen! */
  .react-datepicker__header {
    background-color: #f4f9e6;
    border-bottom: 1px solid #d1e2a5;
  }
  .react-datepicker__day--selected {
    background-color: #88a04d;
  }
`;
