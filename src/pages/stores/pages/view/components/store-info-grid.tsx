import {
  BuildingIcon,
  ClockIcon,
  ExpandIcon,
  LayersIcon,
  MailIcon,
  MapPinIcon,
  NetworkIcon,
  PackageIcon,
  TagIcon,
  WifiIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { StoreReturnSchema } from "@salut-mercado/octo-client";

export function StoreInfoGrid(store: StoreReturnSchema) {
  const { t, i18n } = useTranslation();
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat(i18n.language ?? "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
        {t("stores.view.info.title")}
      </h2>

      <div className="space-y-6">
        {/* Primary Information Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location & Entity Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <MapPinIcon className="size-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t("stores.view.info.cards.location")}
                  </span>
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {store.address}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-2">
                <BuildingIcon className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("stores.view.info.cards.legalEntity")}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {store.legal_entity}
              </p>
            </div>
          </div>

          {/* Operations Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="size-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("stores.view.info.cards.operations")}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("stores.view.info.cards.workingHours")}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {store.working_hours}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("stores.view.info.cards.firstSale")}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(store.date_of_first_sale)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row with Badges */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <LayersIcon className="size-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("stores.view.info.cards.businessMetrics")}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t("stores.view.info.cards.priceGroup")}
                </span>
              </div>
              <div className="text-base font-bold">{store.price}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExpandIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t("stores.view.info.cards.salesArea")}
                </span>
              </div>
              <div className="text-base font-bold">{store.sales_area} m²</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExpandIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t("stores.view.info.cards.totalArea")}
                </span>
              </div>
              <div className="text-base font-bold">{store.total_area} m²</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t("stores.view.info.cards.cluster")}
                </span>
              </div>
              <div className="text-base font-bold">{store.claster}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t("stores.view.info.cards.assortment")}
                </span>
              </div>
              <div className="text-base font-bold">
                {store.assortment_matrix}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <NetworkIcon className="size-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("stores.view.info.cards.network")}
              </span>
            </div>
            <p className="text-sm font-mono font-semibold text-foreground">
              {store.ip}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <WifiIcon className="size-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("stores.view.info.cards.service")}
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {store.service_provider}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <MailIcon className="size-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("stores.view.info.cards.contacts")}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {store.contacts}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
