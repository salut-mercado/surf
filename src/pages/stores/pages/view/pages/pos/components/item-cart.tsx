import type { StoreInventoryItemSchema } from "@salut-mercado/octo-client";
import { BarcodeIcon, PackageIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { formatPrice } from "~/lib/utils/format-price";
import { getPrice } from "~/lib/utils/get-price";
import { usePos } from "./pos.context";

export function InventoryCard({ item }: { item: StoreInventoryItemSchema }) {
  const addToCart = usePos((s) => s.addToCart);
  const pricingMode = usePos((s) => s.pricingMode);
  const price = getPrice({
    pricingMode,
    retail_price_1: item.retail_price_1,
    retail_price_2: item.retail_price_2,
  });

  return (
    <button
      className="bg-card text-card-foreground flex flex-col rounded-xl border p-2 shadow-sm"
      onClick={() => addToCart(item.sku_id)}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg text-left font-bold">
          {formatPrice(price)}
        </span>
        <span
          className={cn(
            "text-xs text-right inline-flex items-center gap-1 font-mono",
            {
              "text-destructive": item.quantity <= 0,
              "text-amber-500": item.quantity > 0 && item.quantity < 5,
              "text-muted-foreground": item.quantity > 5,
            }
          )}
        >
          <PackageIcon className="size-3" /> {item.quantity}
        </span>
      </div>
      <Badge variant="secondary" className="rounded-full">
        <BarcodeIcon className="size-3" />
        {item.barcode}
      </Badge>
      <span className="text-sm w-full inline-block text-left text-muted-foreground mt-2">
        {item.sku_name}
      </span>
    </button>
  );
}
