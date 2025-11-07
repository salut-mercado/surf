import { PaymentType, type SKUReturnSchema } from "@salut-mercado/octo-client";
import { IconBarcode, IconReceipt } from "@tabler/icons-react";
import { Clock, FilePlus2Icon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { CameraButton } from "~/components/composite/camera-button";
import { DashboardPage } from "~/components/dashboard-page";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Numpad } from "~/components/ui/numpad";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/hooks/api";
import { outflows } from "~/hooks/api/outflows";

interface CheckItem {
  barcode: string;
  quantity: number;
  skuName?: string;
}

const PosPage = () => {
  const { t } = useTranslation();
  const { id: storeId } = useParams<{ id: string }>();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data: skusData, isLoading: isLoadingSkus } = api.skus.useGetAll({
    limit: 1000,
  });

  const skusMap = useMemo(() => {
    if (!skusData?.items) return new Map<string, SKUReturnSchema>();
    const map = new Map<string, SKUReturnSchema>();
    skusData.items.forEach((sku) => {
      if (sku.barcode) {
        map.set(sku.barcode, sku);
      }
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
        setError(t("stores.pos.skuNotFound", { barcode: trimmedBarcode }));
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

  const handleQuantityChange = useCallback((barcode: string, delta: number) => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.barcode === barcode
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const handleDeleteItem = useCallback(() => {
    if (!itemToDelete) return;
    setCheckItems((prev) =>
      prev.filter((item) => item.barcode !== itemToDelete)
    );
    setItemToDelete(null);
  }, [itemToDelete]);

  const handleOpenNewCheck = () => {
    setCheckItems([]);
    setError(null);
    setSuccess(false);
    setBarcodeInput("");
  };

  const createStoreSale = outflows.useCreateStoreSale();

  const handleCheckout = async () => {
    if (!storeId || checkItems.length === 0) return;
    try {
      await createStoreSale.mutateAsync({
        store_id: storeId,
        sku_outflow: checkItems.map((item) => ({
          barcode: item.barcode,
          quantity: item.quantity,
        })),
        additional_information: {
          payment_type: PaymentType.cash,
        },
      });
      setSuccess(true);
      setTimeout(() => {
        handleOpenNewCheck();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("stores.pos.createFailed")
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
        <div className="flex items-center justify-end">
          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="gap-2" disabled>
                <Clock className="size-4" />
                {t("stores.pos.history")}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("stores.pos.salesHistory")}</SheetTitle>
                <SheetDescription>
                  {t("stores.pos.salesHistoryDescription")}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <div className="text-center text-muted-foreground py-8">
                  {t("stores.pos.noSalesHistory")}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>{t("stores.pos.checkSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {checkItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {t("stores.pos.scanFirstItem")}
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {checkItems.map((item, index) => (
                      <div key={`${item.barcode}-${index}`}>
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="font-medium">
                              {item.skuName || item.barcode}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.barcode}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.quantity === 1 ? (
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => setItemToDelete(item.barcode)}
                              >
                                −
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() =>
                                  handleQuantityChange(item.barcode, -1)
                                }
                              >
                                −
                              </Button>
                            )}
                            <div className="font-medium w-8 text-center">
                              {item.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() =>
                                handleQuantityChange(item.barcode, 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        {index < checkItems.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center font-medium">
                      <span>{t("stores.pos.totalItems")}</span>
                      <span>{totalQuantity}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={handleCheckout}
                disabled={checkItems.length === 0 || createStoreSale.isPending}
              >
                <IconReceipt className="size-4" />
                {t("stores.pos.checkout")}
              </Button>
            </CardFooter>
          </Card>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBarcode className="size-5" />
                  {t("stores.pos.barcodeScanner")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Input
                    placeholder={t("stores.pos.enterOrScanBarcode")}
                    value={barcodeInput}
                    onChange={handleBarcodeInputChange}
                    onKeyDown={handleBarcodeInputKeyDown}
                  />
                  {barcodeInput.trim() ? (
                    <Button
                      onClick={() => handleAddBarcode(barcodeInput)}
                      variant="secondary"
                    >
                      <FilePlus2Icon className="size-4" />
                      {t("stores.pos.add")}
                    </Button>
                  ) : (
                    <CameraButton
                      variant="secondary"
                      title={t("stores.pos.scanBarcode")}
                      buttonLabel={t("stores.pos.scanBarcode")}
                      icon={IconBarcode}
                      autoCloseOnBarcodeDetected
                      onBarcodeDetected={handleBarcodeDetected}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <Numpad
                onNumberClick={(num) => setBarcodeInput(barcodeInput + num)}
                onBackspace={() => setBarcodeInput(barcodeInput.slice(0, -1))}
                onEnter={() => handleAddBarcode(barcodeInput)}
              />
            </Card>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>{t("stores.pos.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>{t("stores.pos.success")}</AlertTitle>
            <AlertDescription>
              {t("stores.pos.storeSaleCreated")}
            </AlertDescription>
          </Alert>
        )}

        {isLoadingSkus && (
          <div className="flex items-center justify-center py-4">
            <Spinner />
          </div>
        )}
      </div>

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("stores.pos.removeItem")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("stores.pos.removeItemDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              {t("stores.pos.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardPage>
  );
};

export default PosPage;
