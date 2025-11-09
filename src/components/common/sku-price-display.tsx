import { useForm } from "@tanstack/react-form";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import z4 from "zod/v4";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { api } from "~/hooks/api";
import { cn } from "~/lib/utils";
import { formatPrice } from "~/lib/utils/format-price";
import { NumberInput } from "../ui/number-input";
import { SaveButton } from "./save-button";

const validator = z4.object({
  retail_price_1: z4.number().min(0).multipleOf(0.001),
  retail_price_2: z4.number().min(0).multipleOf(0.001).nullable(),
  wholesale_price: z4.number().min(0).multipleOf(0.00001).nullable(),
});

export function SKUPriceDisplay({
  retail_price_1,
  retail_price_2,
  wholesale_price,
  editableId,
}: {
  retail_price_1: number;
  retail_price_2: number | null;
  wholesale_price?: number | null;
  editableId?: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateSku, isPending } = api.skus.useUpdate();

  const form = useForm({
    defaultValues: {
      retail_price_1,
      retail_price_2,
      wholesale_price: wholesale_price ?? null,
    },
    onSubmit: async ({ value }) => {
      if (!editableId) return;
      try {
        await updateSku({
          id: editableId,
          sKUUpdateSchema: {
            retail_price_1: value.retail_price_1,
            retail_price_2: value.retail_price_2 || null,
            wholesale_price: value.wholesale_price || null,
          },
        });
        setOpen(false);
      } catch (error) {
        console.error("Failed to update SKU price", error);
      }
    },
    validators: {
      onChange: validator,
    },
  });

  return (
    <Dialog
      open={editableId !== undefined ? open : false}
      onOpenChange={editableId !== undefined ? setOpen : undefined}
    >
      <DialogTrigger asChild>
        <div className="flex flex-wrap gap-1.5 items-center">
          <BasePriceBadge price={retail_price_1} />
          {retail_price_2 ? <SpecialPriceBadge price={retail_price_2} /> : null}
          {wholesale_price ? (
            <WholesalePriceBadge price={wholesale_price} />
          ) : null}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
          }}
          id="sku-price-display-form"
        >
          <DialogHeader>
            <DialogTitle>{t("skus.priceDialog.editPrice")}</DialogTitle>
            <DialogDescription>
              {t("skus.priceDialog.editPriceDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <form.Field name="retail_price_1">
              {(field) => (
                <Field className="grid gap-3">
                  <FieldLabel htmlFor={field.name}>
                    {t("skus.view.retailPrice1")}
                  </FieldLabel>
                  <NumberInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    min={0}
                    step="0.001"
                    onValueChange={field.handleChange}
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="retail_price_2">
              {(field) => (
                <Field className="grid gap-3">
                  <FieldLabel htmlFor={field.name}>
                    {t("skus.view.retailPrice2")}
                  </FieldLabel>
                  <NumberInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? 0}
                    onBlur={field.handleBlur}
                    min={0}
                    step="0.001"
                    onValueChange={field.handleChange}
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="wholesale_price">
              {(field) => (
                <Field className="grid gap-3">
                  <FieldLabel htmlFor={field.name}>
                    {t("skus.view.wholesalePrice")}
                  </FieldLabel>
                  <NumberInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? 0}
                    onBlur={field.handleBlur}
                    min={0}
                    step="0.00001"
                    onValueChange={field.handleChange}
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
          <DialogFooter className={!isPending ? "mt-2" : ""}>
            <DialogClose asChild>
              <Button variant="outline">{t("common.cancel")}</Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => state.canSubmit}
              children={(canSubmit) => (
                <SaveButton
                  isSubmitting={isPending}
                  disabled={!canSubmit}
                  form="sku-price-display-form"
                  type="submit"
                />
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const AlertPriceDisplay = ({ price }: { price: number }) => {
  return (
    <Badge
      className={cn("font-mono text-xs", {
        "bg-transparent border-yellow-500 text-primary dark:text-primary-foreground": true,
      })}
    >
      <AlertCircleIcon className="size-2 text-yellow-500" />
      {formatPrice(price)}
    </Badge>
  );
};

function BasePriceBadge({ price }: { price: number }) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
        {t("skus.view.retailPrice1Short")}
      </span>
      {price === 0 ? (
        <AlertPriceDisplay price={price} />
      ) : (
        <Badge className="font-mono text-xs">{formatPrice(price)}</Badge>
      )}
    </div>
  );
}

function SpecialPriceBadge({ price }: { price: number }) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex flex-col gap-0.5">
      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">
        {t("skus.view.retailPrice2Short")}
      </span>
      {price === 0 ? (
        <AlertPriceDisplay price={price} />
      ) : (
        <Badge className="font-mono text-xs bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800">
          {formatPrice(price)}
        </Badge>
      )}
    </div>
  );
}

function WholesalePriceBadge({ price }: { price: number }) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex flex-col gap-0.5">
      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">
        {t("skus.view.wholesalePriceShort")}
      </span>
      {price === 0 ? (
        <AlertPriceDisplay price={price} />
      ) : (
        <Badge
          variant="outline"
          className="font-mono text-xs border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"
        >
          {formatPrice(price)}
        </Badge>
      )}
    </div>
  );
}
