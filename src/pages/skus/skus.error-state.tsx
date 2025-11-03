import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export const SkusErrorState = ({ message }: { message: string }) => {
  const { t } = useTranslation();
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{t("skus.errorState.title")}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
      </AlertDescription>
    </Alert>
  );
};


