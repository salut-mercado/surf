import { IconBarcode } from "@tabler/icons-react";
import { Clock } from "lucide-react";
import { useParams } from "wouter";
import { useState, useMemo, useCallback } from "react";
import { DashboardPage } from "~/components/dashboard-page";
import { CameraButton } from "~/components/composite/camera-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { api } from "~/hooks/api";
import { outflows } from "~/hooks/api/outflows";
import { PaymentType, type SKUReturnSchema } from "@salut-mercado/octo-client";

interface CheckItem {
  barcode: string;
  quantity: number;
  skuName?: string;
}

const PosPage = () => {
  const { id: storeId } = useParams<{ id: string }>();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: skusData, isLoading: isLoadingSkus } = api.skus.useGetAll({
    limit: 1000,
  });

  const skusMap = useMemo(() => {
    if (!skusData?.pages) return new Map<string, SKUReturnSchema>();
    const map = new Map<string, SKUReturnSchema>();
    skusData.pages.forEach((page) => {
      page.items.forEach((sku) => {
        if (sku.barcode) {
          map.set(sku.barcode, sku);
        }
      });
    });
    return map;
  }, [skusData]);

  const findSkuByBarcode = useCallback(
    (barcode: string): SKUReturnSchema | undefined => {
      return skusMap.get(barcode);
    },
    [skusMap]
  );

  const handleAddBarcode = useCallback(
    (barcode: string) => {
      setError(null);
      const trimmedBarcode = barcode.trim();
      if (!trimmedBarcode) return;

      const sku = findSkuByBarcode(trimmedBarcode);
      if (!sku) {
        setError(`SKU not found for barcode: ${trimmedBarcode}`);
        return;
      }

      setCheckItems((prev) => {
        const existing = prev.find((item) => item.barcode === trimmedBarcode);
        if (existing) {
          return prev.map((item) =>
            item.barcode === trimmedBarcode
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [
          ...prev,
          { barcode: trimmedBarcode, quantity: 1, skuName: sku.name },
        ];
      });
      setBarcodeInput("");
    },
    [findSkuByBarcode]
  );

  const handleBarcodeDetected = useCallback(
    (barcodes: Array<{ rawValue: string }>) => {
      if (!barcodes.length) return;
      const barcode = barcodes[0].rawValue;
      handleAddBarcode(barcode);
    },
    [handleAddBarcode]
  );

  const handleBarcodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleAddBarcode(barcodeInput);
    }
  };

  const handleOpenNewCheck = () => {
    setCheckItems([]);
    setError(null);
    setSuccess(false);
    setBarcodeInput("");
  };

  const createStoreSale = outflows.useCreateStoreSale();

  const handleCheckout = async () => {
    if (!storeId || checkItems.length === 0) return;

    setError(null);
    setSuccess(false);
    try {
      await createStoreSale.mutateAsync({
        storeSalesOutflowSchema: {
          storeId: storeId,
          skuOutflow: checkItems.map((item) => ({
            barcode: item.barcode,
            quantity: item.quantity,
          })),
          additionalInformation: {
            paymentType: PaymentType.cash,
          },
        },
      });
      setSuccess(true);
      setTimeout(() => {
        handleOpenNewCheck();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create store sale"
      );
    }
  };

  const totalQuantity = checkItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <DashboardPage>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={handleCheckout}
            disabled={checkItems.length === 0 || createStoreSale.isPending}
          >
            <IconBarcode className="size-4" />
            Checkout
          </Button>
          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="gap-2" disabled>
                <Clock className="size-4" />
                History
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sales History</SheetTitle>
                <SheetDescription>
                  View recent store sales transactions.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <div className="text-center text-muted-foreground py-8">
                  No sales history available.
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBarcode className="size-5" />
                Barcode Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter or scan barcode..."
                  value={barcodeInput}
                  onChange={handleBarcodeInputChange}
                  onKeyDown={handleBarcodeInputKeyDown}
                  className="flex-1"
                />
                <CameraButton
                  title="Scan Barcode"
                  buttonLabel="Scan"
                  icon={IconBarcode}
                  autoCloseOnBarcodeDetected
                  onBarcodeDetected={handleBarcodeDetected}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No active check
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {checkItems.map((item, index) => (
                      <div key={`${item.barcode}-${index}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {item.skuName || item.barcode}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.barcode}
                            </div>
                          </div>
                          <div className="font-medium">×{item.quantity}</div>
                        </div>
                        {index < checkItems.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center font-medium">
                      <span>Total Items</span>
                      <span>{totalQuantity}</span>
                    </div>
                  </div>
                </>
              )}

              <Button onClick={handleOpenNewCheck} className="w-full">
                Open New Check
              </Button>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Store sale created successfully.
            </AlertDescription>
          </Alert>
        )}

        {isLoadingSkus && (
          <div className="flex items-center justify-center py-4">
            <Spinner />
          </div>
        )}
      </div>
    </DashboardPage>
  );
};

export default PosPage;
