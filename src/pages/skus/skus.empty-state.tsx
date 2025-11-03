import { IconBarcode } from "@tabler/icons-react";
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

export const SkusEmptyState = () => {
  const { t } = useTranslation();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBarcode />
        </EmptyMedia>
        <EmptyTitle>{t("skus.emptyState.title")}</EmptyTitle>
        <EmptyDescription>
          {t("skus.emptyState.description")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">{t("skus.createSku")}</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};


