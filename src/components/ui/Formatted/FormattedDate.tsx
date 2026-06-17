"use client";

import React from "react";
import { useLocale } from "next-intl";

interface FormattedDateProps {
  date: Date | string | null | undefined;
  options?: Intl.DateTimeFormatOptions;
}

export default function FormattedDate({ date, options = {} }: FormattedDateProps) {
  const locale = useLocale();

  if (!date) return null;

  let dateObj: Date;

  // 1. Safety Check: If it's still a legacy German string format (DD.MM.YYYY)
  if (typeof date === "string" && date.includes(".")) {
    const [day, month, year] = date.split(".");
    dateObj = new Date(`${year}-${month}-${day}`);
  } else {
    // 2. Standard Case: It's either an ISO string or already a pure JS Date object
    dateObj = typeof date === "string" ? new Date(date) : date;
  }

  // 3. Validation
  if (!dateObj || isNaN(dateObj.getTime())) {
    console.warn("FormattedDate: Provided value is invalid:", date);
    return <span>{String(date)}</span>;
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  };

  try {
    return (
      <time dateTime={dateObj.toISOString()}>
        {new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)}
      </time>
    );
  } catch (error) {
    return <span>{String(date)}</span>;
  }
}
