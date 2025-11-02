import { IconUserPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

export const SuppliersEmptyState = () => {
  const { t } = useTranslation();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconUserPlus />
        </EmptyMedia>
        <EmptyTitle>{t("suppliers.emptyState.title")}</EmptyTitle>
        <EmptyDescription>
          {t("suppliers.emptyState.description")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">{t("suppliers.createSupplier")}</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
