import type { StoreInventoryItemSchema } from "@salut-mercado/octo-client";
import { DotIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { formatPrice } from "~/lib/utils/format-price";
import { getPrice } from "~/lib/utils/get-price";
import { usePos } from "../pos.context";
import { PayButton } from "./pay-button";
import { useTranslation } from "react-i18next";

export const Cart = ({
  inventory,
}: {
  inventory: StoreInventoryItemSchema[];
}) => {
  const cart = usePos((s) => s.cart);
  const customItems = usePos((s) => s.customItems);
  const pricingMode = usePos((s) => s.pricingMode);

  const regularItems = inventory
    .filter((item) => cart.has(item.sku_id) && !item.sku_id.startsWith("custom-"))
    .map((i) => ({
      item: i,
      cart: cart.get(i.sku_id)!,
    }))
    .sort((a, b) => a.cart.order - b.cart.order);

  const customCartItems = Array.from(cart.entries())
    .filter(([id]) => id.startsWith("custom-"))
    .map(([id, cartData]) => {
      const customItem = customItems.get(id);
      if (!customItem) return null;
      return {
        id,
        name: customItem.name,
        barcode: customItem.barcode,
        price: customItem.price,
        cart: cartData,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.cart.order - b.cart.order);

  const itemsWithPriceAndVatNormalized = [
    ...regularItems.map(({ item, cart }) => ({
      item,
      cart,
      price: getPrice({
        pricingMode,
        retail_price_1: item.retail_price_1,
        retail_price_2: item.retail_price_2,
      }),
      vat: Number(item.vat_percent ?? "0") / 100,
      count: cart.count,
      isCustom: false as const,
    })),
    ...customCartItems.map((customItem) => ({
      customItem,
      cart: customItem.cart,
      price: customItem.price,
      vat: 0.21,
      count: customItem.cart.count,
      isCustom: true as const,
    })),
  ].sort((a, b) => a.cart.order - b.cart.order);

  const subtotal = itemsWithPriceAndVatNormalized.reduce(
    (acc, { price, vat, count }) => acc + (price - price * vat) * count,
    0
  );

  const tax = itemsWithPriceAndVatNormalized.reduce(
    (acc, { price, vat, count }) => acc + price * vat * count,
    0
  );

  const total = itemsWithPriceAndVatNormalized.reduce(
    (acc, { price, count }) => acc + price * count,
    0
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <CartHeader items={itemsWithPriceAndVatNormalized} />
      <ScrollArea className="flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col gap-2 pr-2">
          {itemsWithPriceAndVatNormalized.map((entry) =>
            entry.isCustom ? (
              <CustomCartItem
                key={entry.customItem.id}
                customItem={entry.customItem}
                cart={entry.cart}
                price={entry.price}
              />
            ) : (
              <CartItem
                key={entry.item.sku_id}
                item={entry.item}
                cart={entry.cart}
                price={entry.price}
              />
            )
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto">
        <Separator className="w-full" />
        <CartSummary subtotal={subtotal} tax={tax} total={total} />
        <PayButton items={itemsWithPriceAndVatNormalized} total={total} />
      </div>
    </div>
  );
};

const CartItem = ({
  item,
  cart,
  price,
}: {
  item: StoreInventoryItemSchema;
  cart: { count: number; order: number };
  price: number;
}) => {
  const removeFromCart = usePos((s) => s.removeFromCart);
  const addToCart = usePos((s) => s.addToCart);
  return (
    <div
      className="bg-muted rounded p-3 flex items-center justify-between"
      key={item.sku_id}
    >
      <div className="flex flex-col gap-0.5">
        <span>{item.sku_name}</span>
        <div className="inline-flex items-center gap-0.5">
          <span className="text-muted-foreground text-sm">
            {formatPrice(price * cart.count)}
          </span>
          <DotIcon className="size-3" />
          <span className="text-muted-foreground text-sm">{cart.count}x</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => removeFromCart(item.sku_id)}
        >
          <MinusIcon className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => addToCart(item.sku_id)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const CustomCartItem = ({
  customItem,
  cart,
  price,
}: {
  customItem: { id: string; name: string; barcode: string; price: number };
  cart: { count: number; order: number };
  price: number;
}) => {
  const removeFromCart = usePos((s) => s.removeFromCart);
  const addToCart = usePos((s) => s.addToCart);
  return (
    <div className="bg-muted rounded p-3 flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span>{customItem.name}</span>
        <div className="inline-flex items-center gap-0.5">
          <span className="text-muted-foreground text-sm">
            {formatPrice(price * cart.count)}
          </span>
          <DotIcon className="size-3" />
          <span className="text-muted-foreground text-sm">{cart.count}x</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => removeFromCart(customItem.id)}
        >
          <MinusIcon className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => addToCart(customItem.id)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const CartHeader = ({
  items,
}: {
  items: {
    item?: StoreInventoryItemSchema;
    customItem?: { id: string; name: string; barcode: string; price: number };
    cart: {
      count: number;
      priceOverride?: number;
      order: number;
    };
    isCustom?: boolean;
  }[];
}) => {
  const { t } = useTranslation();
  const clearCart = usePos((s) => s.clearCart);
  return (
    <div className="flex flex-col gap-2">
      <span className="inline-flex justify-between w-full items-center">
        <span className="inline-flex items-center">
          {t("stores.pos.cart")}
          <Badge className="ml-2">{items.length} {t("stores.pos.items")}</Badge>
        </span>
        <Button variant="link" onClick={clearCart}>
          {t("stores.pos.clear")}
        </Button>
      </span>
    </div>
  );
};

const CartSummary = ({
  subtotal,
  tax,
  total,
}: {
  subtotal: number;
  tax: number;
  total: number;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 pt-2">
      <span className="inline-flex justify-between w-full text-muted-foreground text-sm">
        <span>{t("stores.pos.subtotal")}</span>
        <span>{formatPrice(subtotal)}</span>
      </span>
      <span className="inline-flex justify-between w-full text-muted-foreground text-sm">
        <span>{t("stores.pos.tax")}</span>
        <span>{formatPrice(tax)}</span>
      </span>
      <span className="inline-flex justify-between w-full text-lg mt-1">
        <span>{t("stores.pos.total")}</span>
        <span className="font-bold">{formatPrice(total)}</span>
      </span>
    </div>
  );
};
