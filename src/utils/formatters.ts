// Tipos opcionais para personalização futura
export interface FormatDateOptions {
  locale?: string;
}

export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string; // default: EUR
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Safe Date Formatter
export const formatDate = (
  iso?: string | number | null,
  options: FormatDateOptions = {}
): string => {
  if (!iso) return "";

  const { locale = "pt-PT" } = options;

  const date =
    typeof iso === "number" ? new Date(iso) : new Date(String(iso).trim());

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(locale);
};

// Safe Currency Formatter
export const formatCurrency = (
  value?: number | string | null,
  options: FormatCurrencyOptions = {}
): string => {
  const {
    locale = "pt-PT",
    currency = "EUR",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const n = Number(value);

  if (Number.isNaN(n)) {
    return `€ 0.00`;
  }

  return n.toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });
};
