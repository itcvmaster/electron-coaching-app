import i18n from "i18next";

export function i18nString(en) {
  return {
    // TODO: make sure key exists in translation files or do sth more
    transKey: en,
    englishFallbackText: en,
  };
}

export function getLocale() {
  return i18n.language || i18n.options.fallbackLng?.[0];
}

export function getLocaleString(n, options) {
  const locale = getLocale();
  return (n || 0).toLocaleString(locale, options);
}

export const getLocaleRate = (a, b, options) => {
  a = a || 0;
  b = b || 1;

  try {
    const v = (a / b).toLocaleString(
      getLocale(),
      options || {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }
    );

    return v;
  } catch (e) {
    return (a / b).toFixed(0);
  }
};

export const toDecimal = (x) =>
  new Intl.NumberFormat(getLocale(), { style: "decimal" }).format(x);

export const toPercent = (x) =>
  new Intl.NumberFormat(getLocale(), { style: "percent" }).format(x);
