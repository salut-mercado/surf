import type { SKUReturnSchema } from "@salut-mercado/octo-client";
import {
  Building2Icon,
  FactoryIcon,
  FolderTreeIcon,
  InfoIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export const ProductInfo = ({
  sku,
  ...props
}: { sku: SKUReturnSchema } & ComponentProps<typeof Card>) => {
  const { t } = useTranslation();
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <InfoIcon className="size-4 text-muted-foreground" />
          {t("skus.view.productInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem
          icon={FolderTreeIcon}
          label={t("skus.view.category")}
          value={sku.categoryId}
        />
        <Separator />
        <DetailItem
          icon={Building2Icon}
          label={t("skus.view.supplier")}
          value={sku.supplierId}
        />
        <Separator />
        <DetailItem
          icon={FactoryIcon}
          label={t("skus.view.producer")}
          value={sku.producerId}
        />
      </CardContent>
    </Card>
  );
};

function DetailItem({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <label className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <p
          className={`mt-0.5 text-sm font-medium ${mono ? "font-mono text-xs" : ""} break-all`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
