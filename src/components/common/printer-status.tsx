import { IconPrinterOff } from "@tabler/icons-react";
import { PrinterCheckIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { usePrinterSettings } from "~/hooks/printer/use-printer-settings";
import { Button } from "../ui/button";
import { FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useRef, useState } from "react";

export const PrinterStatus = ({
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const [settings, updater] = usePrinterSettings();
  const [vendorId, setVendorId] = useState(settings?.vendor_id || 0);
  const [productId, setProductId] = useState(settings?.product_id || 0);
  const hasSetSettings = useRef(false);

  useEffect(() => {
    if (
      hasSetSettings.current ||
      settings == null ||
      settings.vendor_id === 0 ||
      settings.product_id === 0
    ) {
      return;
    }
    setVendorId(settings.vendor_id);
    setProductId(settings.product_id);
    hasSetSettings.current = true;
  }, [settings]);

  const hasSettings =
    settings != null && settings.vendor_id !== 0 && settings.product_id !== 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant={hasSettings ? "outline" : "destructive"} {...props}>
          {hasSettings ? (
            <PrinterCheckIcon className="size-4" />
          ) : (
            <IconPrinterOff className="size-4" />
          )}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (vendorId == null || productId == null) {
              return;
            }
            updater({ vendor_id: vendorId, product_id: productId });
          }}
          className="flex flex-col gap-2"
        >
          <FieldGroup className="flex flex-col gap-2">
            <FieldLabel htmlFor="vendor-id">Vendor ID</FieldLabel>
            <Input
              type="number"
              id="vendor-id"
              value={vendorId}
              onChange={(e) => setVendorId(Number(e.target.value))}
            />
          </FieldGroup>
          <FieldGroup className="flex flex-col gap-2">
            <FieldLabel htmlFor="product-id">Product ID</FieldLabel>
            <Input
              type="number"
              id="product-id"
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
            />
          </FieldGroup>
          <Button type="submit">Save</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
