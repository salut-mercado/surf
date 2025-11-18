import {
  PaymentType,
  type SKUOutflowSchema,
  type StoreInventoryItemSchema,
} from "@salut-mercado/octo-client";
import { IconCashBanknote, IconCreditCard } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/hooks/api";
import { usePos } from "../pos.context";
import { useState } from "react";
import { formatPrice } from "~/lib/utils/format-price";
import { useTranslation } from "react-i18next";

type Item = {
  item: StoreInventoryItemSchema;
  cart: { count: number; priceOverride?: number; order: number };
  price: number;
  vat: number;
  count: number;
};

export const PayButton = ({
  items,
  total,
}: {
  items: Item[];
  total: number;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const storeId = usePos((state) => state.storeId);
  const clearCart = usePos((state) => state.clearCart);
  const createOutflow = api.outflows.useCreateStoreSale();
  const cart = usePos((state) => state.cart);
  const isCartEmpty = cart.size === 0;

  const handlePay = (paymentType: PaymentType) => async () => {
    const outflows: SKUOutflowSchema[] = [];

    for (const [id, item] of cart.entries()) {
      const sku = items.find((i) => i.item.sku_id === id);
      if (!sku) {
        // TODO: Handle free sale items
        continue;
      } else {
        outflows.push({
          barcode: sku.item.barcode,
          quantity: item.count,
          price: sku.price,
        });
      }
    }

    try {
      await createOutflow.mutateAsync({
        store_id: storeId,
        additional_information: {
          payment_type: paymentType,
        },
        sku_outflow: outflows,
      });
      clearCart();
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full mt-2"
          disabled={isCartEmpty}
          onClick={() => setOpen(true)}
        >
          {t("stores.pos.pay")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{formatPrice(total)}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex gap-2 flex-nowrap">
          <Button
            variant="outline"
            className="flex-1 h-32 flex-col text-lg"
            disabled={createOutflow.isPending}
            onClick={handlePay(PaymentType.card)}
          >
            <IconCreditCard className="size-8" stroke={1} /> {t("stores.pos.creditCard")}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-32 flex-col text-lg"
            disabled={createOutflow.isPending}
            onClick={handlePay(PaymentType.cash)}
          >
            <IconCashBanknote className="size-8" stroke={1} /> {t("stores.pos.cash")}
          </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
