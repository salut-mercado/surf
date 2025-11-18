import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Numpad } from "~/components/ui/numpad";
import { formatPrice } from "~/lib/utils/format-price";
import { usePos } from "./pos.context";

interface CustomItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomItemDialog({
  open,
  onOpenChange,
}: CustomItemDialogProps) {
  const { t } = useTranslation();
  const addCustomItem = usePos((s) => s.addCustomItem);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState(t("stores.pos.unrecognizedItem"));
  const [price, setPrice] = useState("0");
  const [priceError, setPriceError] = useState<string | null>(null);

  const handleNumberClick = (num: string) => {
    setPriceError(null);
    if (price === "0") {
      setPrice(num);
    } else {
      setPrice((prev) => prev + num);
    }
  };

  const handleDecimalPoint = () => {
    setPriceError(null);
    setPrice((prev) => {
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
  };

  const handleBackspace = () => {
    setPriceError(null);
    setPrice((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const handleSubmit = () => {
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setPriceError("Price must be greater than 0");
      return;
    }

    const finalBarcode = barcode.trim() || crypto.randomUUID();
    const customId = `custom-${crypto.randomUUID()}`;

    addCustomItem(customId, {
      name: name.trim() || t("stores.pos.unrecognizedItem"),
      barcode: finalBarcode,
      price: priceValue,
    });

    // Reset form
    setBarcode("");
    setName(t("stores.pos.unrecognizedItem"));
    setPrice("0");
    setPriceError(null);
    onOpenChange(false);
  };

  const priceValue = parseFloat(price) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("stores.pos.customItem.title")}</DialogTitle>
          <DialogDescription>
            {t("stores.pos.customItem.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Field className="grid gap-2">
              <FieldLabel htmlFor="barcode">
                {t("skus.form.fields.barcode")}
              </FieldLabel>
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder={t("skus.form.fields.barcode")}
              />
              <FieldDescription>
                {t("stores.pos.customItem.barcodeDescription")}
              </FieldDescription>
            </Field>

            <Field className="grid gap-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("stores.pos.unrecognizedItem")}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-4">
            <Field className="grid gap-2">
              <FieldLabel htmlFor="price">Price</FieldLabel>
              <div className="flex items-center justify-center p-4 border rounded-lg bg-muted/50">
                <span className="text-2xl font-bold">
                  {formatPrice(priceValue)}
                </span>
              </div>
              {priceError && (
                <FieldError errors={[{ message: priceError }]} />
              )}
              <Numpad
                onNumberClick={handleNumberClick}
                onBackspace={handleBackspace}
                onEnter={handleSubmit}
                onDecimalPoint={handleDecimalPoint}
                className="mt-2"
              />
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={priceValue <= 0}>
            {t("stores.pos.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

