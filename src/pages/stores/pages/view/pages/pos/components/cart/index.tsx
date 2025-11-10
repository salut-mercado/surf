import type { StoreInventoryItemSchema } from "@salut-mercado/octo-client";
import { DotIcon, MinusIcon, PlusIcon } from "lucide-react";
import { formatPrice } from "~/lib/utils/format-price";
import { usePos } from "../pos.context";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";

export const Cart = ({
  inventory,
}: {
  inventory: StoreInventoryItemSchema[];
}) => {
  const cart = usePos((s) => s.cart);
  const items = inventory
    .filter((item) => cart.has(item.sku_id))
    .map((i) => ({
      item: i,
      cart: cart.get(i.sku_id)!,
    }))
    .sort((a, b) => a.cart.order - b.cart.order);
  return (
    <div className="flex flex-col gap-2 h-full">
      <CartHeader items={items} />
      <ScrollArea>
        <div className="flex flex-col gap-2">
          {items.map(({ cart, item }) => (
            <CartItem key={item.sku_id} item={item} cart={cart} />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className="mt-auto">
        <Separator className="w-full" />
        <CartSummary items={items} />
        <Button className="w-full mt-2">Pay</Button>
      </div>
    </div>
  );
};

const CartItem = ({
  item,
  cart,
}: {
  item: StoreInventoryItemSchema;
  cart: { count: number; order: number };
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
            {formatPrice(Number(item.retail_price_1 ?? "0") * cart.count)}
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

const CartHeader = ({
  items,
}: {
  items: {
    item: StoreInventoryItemSchema;
    cart: {
      count: number;
      priceOverride?: number;
      order: number;
    };
  }[];
}) => {
  const clearCart = usePos((s) => s.clearCart);
  return (
    <div className="flex flex-col gap-2">
      <span className="inline-flex justify-between w-full items-center">
        <span className="inline-flex items-center">
          Cart
          <Badge className="ml-2">{items.length} items</Badge>
        </span>
        <Button variant="link" onClick={clearCart}>
          Clear
        </Button>
      </span>
    </div>
  );
};

const CartSummary = ({
  items,
}: {
  items: {
    item: StoreInventoryItemSchema;
    cart: {
      count: number;
      priceOverride?: number;
      order: number;
    };
  }[];
}) => {
  const subtotal = items.reduce(
    (acc, { cart, item }) =>
      acc +
      (Number(item.retail_price_1 ?? "0") -
        (Number(item.retail_price_1 ?? "0") * Number(item.vat_percent ?? "0")) /
          100) *
        cart.count,
    0
  );
  const tax = items.reduce(
    (acc, { cart, item }) =>
      acc +
      Number(item.retail_price_1 ?? "0") *
        (Number(item.vat_percent ?? "0") / 100) *
        cart.count,
    0
  );
  const total = items.reduce(
    (acc, { cart, item }) =>
      acc + Number(item.retail_price_1 ?? "0") * cart.count,
    0
  );
  return (
    <div className="flex flex-col gap-2 pt-2">
      <span className="inline-flex justify-between w-full text-muted-foreground text-sm">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </span>
      <span className="inline-flex justify-between w-full text-muted-foreground text-sm">
        <span>Tax</span>
        <span>{formatPrice(tax)}</span>
      </span>
      <span className="inline-flex justify-between w-full text-lg mt-1">
        <span>Total</span>
        <span className="font-bold">{formatPrice(total)}</span>
      </span>
    </div>
  );
};
