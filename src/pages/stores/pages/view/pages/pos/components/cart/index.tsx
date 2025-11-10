import type { StoreInventoryItemSchema } from "@salut-mercado/octo-client";
import { usePos } from "../pos.context";

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
    <div className="flex flex-col gap-2">
      {items.map(({ cart, item }) => (
        <div key={item.sku_id}>
          <span>{item.sku_name}</span>
          <span>{cart.count}</span>
        </div>
      ))}
    </div>
  );
};
