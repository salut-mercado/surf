import {
  IconCash,
  IconDotsVertical,
  IconPrinter,
  IconPrinterOff,
} from "@tabler/icons-react";
import { PrinterCheckIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { usePrinterSettings } from "~/hooks/printer/use-printer-settings";
import { Button } from "../ui/button";
import { FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useRef, useState } from "react";
import { usePrinter } from "~/hooks/printer/use-printer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Receipt } from "~/lib/receipt";

const EXAMPLE_RECEIPT = `{image:iVBORw0KGgoAAAANSUhEUgAAAQAAAAA8AgMAAAD004yXAAAACVBMVEVwAJsAAAD///+esS7BAAAAAXRSTlMAQObYZgAAAZtJREFUSMftlkGOwyAMRW0J76kE97GlZu9KcP+rzCekKak6bWdGmrZS6KIG/7yAbQhEe+tN6qUpDZ1KPHT8SnhpeaP6FlA2wicBsgOeBpTF6gDfZHgj9Jt1sAMeAYYE/RFQngYMuX49gD8fMObjkwB+++h+DeB3x/qdvfD/AP4QwPXX+ceAUdV6Y7K/3Vr7rWhv73ZN9XVHzOUdlm6v9ay3pM1eLT+Ppv63BWjz8jJU0vpUWgGs5yfihrN451G+lq7i2bkF8Bagw3Qv0hEQKGTPPjnGxJtZrSIcJy5ciJ3JStbarjrgwOtVK7Z1iLFOOgOSR3WstTqMqCcVFlITDnhhNhMKzJNIA3iEBr1uaAfArA7bSWdAkRrIsJSMrwXbJBowEhogwe9F+NilC8D1oIyg43fA+1WwKpoktXUmsiOCjxFMR+gEBfwcaJ7qDBBWNTVSxKsZZhwkUgkppEiJ1VOIQdCFtAmNBQg9QWj9POQWFW4Bh0HVipRIHlpEUVzUAmslpgQpVcS0SklcrBqf03u/UvVhLd8H5Hffil/ia4Io3warBgAAAABJRU5ErkJggg==}

          Ichigaya Terminal
       1-Y-X Kudan, Chiyoda-ku
-------------------------------------
03-18-2024 12:34
{border:line}
^RECEIPT
{border:space}
{width:*,2,10}
HAMBURGER              | 2|     24.00
COFFEE                 | 2|     12.00
-------------------------------------
{width:*,20}
^TOTAL             |           ^36.00
CASH               |            40.00
CHANGE             |             4.00
{code:20240318123456;option:code128,48}`;

export const PrinterStatus = ({
  ...props
}: React.ComponentProps<typeof Badge>) => {
  const [settings, updater] = usePrinterSettings();
  const [vendorId, setVendorId] = useState(settings?.vendor_id || 0);
  const [productId, setProductId] = useState(settings?.product_id || 0);
  const hasSetSettings = useRef(false);
  const { cut, print, cashdraw } = usePrinter();

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
          <div className="flex gap-2 flex-nowrap">
            <Button type="submit" className="flex-1">
              Save
            </Button>
            {hasSettings && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    <IconDotsVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={async () => {
                      const example = Receipt.from(
                        EXAMPLE_RECEIPT,
                        "-c 42 -p escpos -n"
                      );
                      const instructions = await example.toCommand();
                      print(Receipt.prepareCommand(instructions)).then(() => cut());
                    }}
                  >
                    <IconPrinter className="size-4" />
                    Test Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={cashdraw}>
                    <IconCash className="size-4" />
                    Test cashdraw
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
