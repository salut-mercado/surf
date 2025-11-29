import { PaymentType } from "@salut-mercado/octo-client";
import { IconCashBanknote } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Numpad } from "~/components/ui/numpad";
import { usePrinter } from "~/hooks/printer/use-printer";
import { formatPrice } from "~/lib/utils/format-price";

export const CashCalculator = ({
  handlePay,
  isPending,
  total,
}: {
  isPending: boolean;
  total: number;
  handlePay: (paymentType: PaymentType) => () => void;
}) => {
  const { t } = useTranslation();
  const { cashdraw } = usePrinter();
  const [open, setOpen] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState("0");

  const handleNumberClick = (num: string) => {
    if (enteredAmount === "0") {
      setEnteredAmount(num);
    } else {
      setEnteredAmount((prev) => prev + num);
    }
  };

  const handleDecimalPoint = () => {
    setEnteredAmount((prev) => {
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
  };

  const handleBackspace = () => {
    setEnteredAmount((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const enteredValue = parseFloat(enteredAmount) || 0;
  const change = enteredValue - total;
  const canPay = enteredValue >= total;

  const onPay = () => {
    handlePay(PaymentType.cash)();
    setOpen(false);
    setEnteredAmount("0");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-32 flex-col text-lg"
          disabled={isPending}
          onClick={() => {
            cashdraw();
            setEnteredAmount("0");
          }}
        >
          <IconCashBanknote className="size-8" stroke={1} />{" "}
          {t("stores.pos.cash")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("stores.pos.cashPayment")}</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the amount of cash to pay with.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="flex flex-col gap-6 justify-center">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Total to Pay
              </div>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(total)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Amount Entered
              </div>
              <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                <span className="text-3xl font-bold">
                  {formatPrice(enteredValue)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Change
              </div>
              <div
                className={`text-3xl font-bold ${
                  change >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {formatPrice(Math.max(0, change))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Numpad
              onNumberClick={handleNumberClick}
              onBackspace={handleBackspace}
              onEnter={canPay ? onPay : undefined}
              onDecimalPoint={handleDecimalPoint}
              className="w-full max-w-sm"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEnteredAmount("0")}>
            {t("common.cancel")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
