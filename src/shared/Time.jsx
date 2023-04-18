import React from "react";

import { IS_NODE } from "@/util/dev.mjs";
import { getLocale } from "@/util/i18n-helper.mjs";

if (!IS_NODE) {
  import("@github/time-elements");
}

function castDate(date) {
  if (typeof date === "number") {
    date = new Date(date);
  }
  if (date instanceof Date) {
    date = date.toISOString();
  }
  return date;
}

// This is meant to be used to display a proper duration, but only
// *if it is uncertain whether the date is past or future*.
export function TimeRelative(props) {
  const isPast = new Date(props.date) < Date.now();
  return isPast ? TimeAgo(props) : TimeUntil(props);
}

export function TimeAgo({ date, format }) {
  return (
    <>
      <time-ago datetime={castDate(date)} lang={getLocale()} format={format} />
    </>
  );
}

export function TimeUntil({ date, format }) {
  return (
    <>
      <time-until
        datetime={castDate(date)}
        lang={getLocale()}
        format={format}
      />
    </>
  );
}
