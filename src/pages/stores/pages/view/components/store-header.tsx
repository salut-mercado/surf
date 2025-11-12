import type { StoreReturnSchema } from "@salut-mercado/octo-client";
import { EditIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";

export function StoreHeader({ address, legal_entity, id }: StoreReturnSchema) {
  const { t } = useTranslation();
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {address}
        </h1>
        <p className="text-muted-foreground mt-1">{legal_entity}</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={`~/stores/${id}/edit`}>
          <EditIcon className="size-4 mr-2" />
          {t("stores.view.edit")}
        </Link>
      </Button>
    </header>
  );
}
