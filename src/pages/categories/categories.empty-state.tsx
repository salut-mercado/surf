import { IconFolderPlus } from "@tabler/icons-react";
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

export const CategoriesEmptyState = () => {
  const { t } = useTranslation();
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderPlus />
        </EmptyMedia>
        <EmptyTitle>{t("categories.emptyState.title")}</EmptyTitle>
        <EmptyDescription>
          {t("categories.emptyState.description")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">{t("categories.createCategory")}</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};


