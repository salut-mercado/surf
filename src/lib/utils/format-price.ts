import i18n from "../i18n";

// Format price with currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
