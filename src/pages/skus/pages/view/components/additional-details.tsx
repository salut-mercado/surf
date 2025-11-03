import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import { FileTextIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const AdditionalDetails = ({
  sku,
  ...props
}: { sku: SKUReturnSchema } & ComponentProps<typeof Card>) => {
  const { t } = useTranslation();
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileTextIcon className="size-4 text-muted-foreground" />
          {t("skus.view.additionalDetails")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p
            className={`mt-1.5 text-sm ${sku.specifications ? "" : "text-muted-foreground italic"}`}
          >
            {sku.specifications || t("common.n/a")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
