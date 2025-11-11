import { IconShoppingCart } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { usePos } from "./pos.context";

export const PosShortcuts = ({
  className,
  ...props
}: ComponentProps<"div">) => {
  const pricingMode = usePos((s) => s.pricingMode);
  const setPricingMode = usePos((s) => s.setPricingMode);

  return (
    <Card className={cn("p-2 grid grid-cols-3 gap-2", className)} {...props}>
      <Button
        variant={pricingMode === "normal" ? "outline" : "default"}
        onClick={() =>
          setPricingMode(pricingMode === "normal" ? "special" : "normal")
        }
      >
        <IconShoppingCart className="size-4" />
        Shopping mode
      </Button>
      <Button variant="outline" disabled>
        Enter barcode
      </Button>
      <Button variant="outline" disabled>
        Custom item
      </Button>
    </Card>
  );
};
