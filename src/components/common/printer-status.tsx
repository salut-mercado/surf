import {
  IconCash,
  IconCut,
  IconPrinter,
  IconPrinterOff,
} from "@tabler/icons-react";
import { PrinterCheckIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { FieldGroup, FieldLabel } from "~/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { usePrinter } from "~/hooks/printer/use-printer";
import { usePrinterSettings } from "~/hooks/printer/use-printer-settings";
import { useUsbDevices } from "~/hooks/use-usb-devices";
import { testReceipt } from "~/receipts/test-receipt";
import { useGlobalStore } from "~/store/global.store";
import { ButtonGroup } from "../ui/button-group";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { cn } from "~/lib/utils";

export const PrinterStatus = ({
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const [settings, updater] = usePrinterSettings();
  const usbDevices = useUsbDevices({ enabled: settings != null });
  const { cut, print, cashdraw } = usePrinter();
  const receiptWidth = useGlobalStore((state) => state.receiptWidth);
  const setReceiptWidth = useGlobalStore((state) => state.setReceiptWidth);

  const id =
    settings?.vendor_id && settings.product_id
      ? `${settings?.vendor_id}-${settings?.product_id}`
      : undefined;

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
        <div className="flex flex-col gap-2">
          <FieldGroup className="flex flex-col gap-2">
            <FieldLabel htmlFor="printer-select">Printer</FieldLabel>
            <Select
              value={id}
              onValueChange={(v) => {
                const [vendorId, productId] = v.split("-");
                updater({
                  vendor_id: Number(vendorId),
                  product_id: Number(productId),
                });
              }}
            >
              <SelectTrigger
                className="w-full"
                id="printer-select"
                disabled={
                  usbDevices.isLoading ||
                  usbDevices.isError ||
                  usbDevices.data == null ||
                  usbDevices.data.length === 0
                }
              >
                <SelectValue placeholder="Select printer" />
              </SelectTrigger>
              <SelectContent>
                {usbDevices.data?.map((device) => (
                  <SelectItem
                    key={device.name}
                    value={`${device.vendor_id}-${device.product_id}`}
                  >
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>
          <FieldGroup className="flex flex-col gap-2">
            <FieldLabel htmlFor="receipt-width-select">
              Receipt Width
            </FieldLabel>
            <ToggleGroup
              id="receipt-width-select"
              type="single"
              variant="outline"
              size="sm"
              value={receiptWidth.toString()}
              onValueChange={(v) => setReceiptWidth(Number(v) as 80 | 58)}
            >
              <ToggleGroupItem
                value="58"
                aria-label="Select 58mm receipt width"
              >
                58mm
              </ToggleGroupItem>
              <ToggleGroupItem
                value="80"
                aria-label="Select 80mm receipt width"
              >
                80mm
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldGroup>
          <FieldGroup className={cn("flex flex-col gap-2", !id ? "hidden" : "")}>
            <FieldLabel htmlFor="print-button-group">Print</FieldLabel>
            <ButtonGroup id="print-button-group">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const instructions = await testReceipt({
                    cash: 100,
                    items: [{ name: "Test Item", quantity: 3, price: 10 }],
                  });
                  await print(instructions);
                  await cut();
                }}
              >
                <IconPrinter className="size-4" />
                Print
              </Button>
              <Button size="sm" onClick={cashdraw} variant="outline">
                <IconCash className="size-4" />
                Cashdraw
              </Button>
              <Button size="sm" onClick={cut} variant="outline">
                <IconCut className="size-4" />
                Cut
              </Button>
            </ButtonGroup>
          </FieldGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
};
