import type { ComponentProps } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "../ui/spinner";
import { SaveIcon } from "lucide-react";

export function SaveButton({
  isSubmitting,
  disabled,
  ...props
}: Omit<ComponentProps<typeof Button>, "children"> & {
  isSubmitting: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Button {...props} disabled={disabled || isSubmitting}>
      {isSubmitting ? <Spinner /> : <SaveIcon className="size-4" />}
      {isSubmitting ? t("common.saving") : t("common.save")}
    </Button>
  );
}
