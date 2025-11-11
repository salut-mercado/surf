export const getPrice = ({
  pricingMode,
  retail_price_1,
  retail_price_2,
}: {
  retail_price_1?: number | string | null;
  retail_price_2?: number | string | null;
  pricingMode: "normal" | "special";
}) => {
  const price1AsNumber = Number(retail_price_1);
  const price2AsNumber = retail_price_2 ? Number(retail_price_2) : null;

  const price1Normalized = Number.isNaN(price1AsNumber) ? 0 : price1AsNumber;
  const price2Normalized = retail_price_2
    ? Number.isNaN(price2AsNumber)
      ? 0
      : price2AsNumber
    : null;

  if (pricingMode === "normal") {
    return price1Normalized;
  }

  return price2Normalized || price1Normalized;
};
