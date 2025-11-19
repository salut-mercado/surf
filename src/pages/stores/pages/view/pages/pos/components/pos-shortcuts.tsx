import { IconShoppingCart } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { usePos } from "./pos.context";
import { useTranslation } from "react-i18next";
import { CustomItemDialog } from "./custom-item-dialog";

export const PosShortcuts = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  const { t } = useTranslation();
  const pricingMode = usePos((s) => s.pricingMode);
  const setPricingMode = usePos((s) => s.setPricingMode);
  const [customItemDialogOpen, setCustomItemDialogOpen] = useState(false);

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
        <Button variant="outline" disabled>
          {t("stores.pos.enterBarcode")}
        </Button>
        <Button
          variant="outline"
          onClick={() => setCustomItemDialogOpen(true)}
        >
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
