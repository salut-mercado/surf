export const SKUImage = ({ barcode }: { barcode: string }) => {
  const paddedBarcode = barcode.padStart(13, "0");
  const splits = [
    paddedBarcode.slice(0, 3),
    paddedBarcode.slice(3, 6),
    paddedBarcode.slice(6, 9),
    paddedBarcode.slice(9),
  ];
  return (
    <div>
      <img
        src={`https://images.openfoodfacts.org/images/products/${splits.join("/")}/1.400.jpg`}
        alt="SKU Image"
      />
    </div>
  );
};
