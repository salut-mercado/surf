import { IconCash, IconShoppingCart } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { usePos } from "./pos.context";
import { useTranslation } from "react-i18next";
import { CustomItemDialog } from "./custom-item-dialog";
import { usePrinter } from "~/hooks/printer/use-printer";
import { usePrinterSettings } from "~/hooks/printer/use-printer-settings";

export const PosShortcuts = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  const { t } = useTranslation();
  const pricingMode = usePos((s) => s.pricingMode);
  const setPricingMode = usePos((s) => s.setPricingMode);
  const [customItemDialogOpen, setCustomItemDialogOpen] = useState(false);
  const { cashdraw } = usePrinter();
  const [printerSettings] = usePrinterSettings();
  return (
    <>
      <Card className={cn("p-2 grid grid-cols-3 gap-2", className)} {...props}>
        <Button
          variant={pricingMode === "normal" ? "outline" : "default"}
          onClick={() =>
            setPricingMode(pricingMode === "normal" ? "special" : "normal")
          }
        >
          <IconShoppingCart className="size-4" />
          {t("stores.pos.shoppingMode")}
        </Button>
        <Button
          variant="outline"
          onClick={() => cashdraw()}
          disabled={
            printerSettings == null ||
            printerSettings.vendor_id === 0 ||
            printerSettings.product_id === 0
          }
        >
          <IconCash className="size-4" />
          {t("stores.pos.openDrawer")}
        </Button>
        <Button variant="outline" onClick={() => setCustomItemDialogOpen(true)}>
          {t("stores.pos.customItem.title")}
        </Button>
      </Card>
      <CustomItemDialog
        open={customItemDialogOpen}
        onOpenChange={setCustomItemDialogOpen}
      />
    </>
  );
};
