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

export const ProducersEmptyState = () => {
  const { t } = useTranslation();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconUserPlus />
        </EmptyMedia>
        <EmptyTitle>{t("producers.emptyState.title")}</EmptyTitle>
        <EmptyDescription>
          {t("producers.emptyState.description")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">{t("producers.createProducer")}</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};


