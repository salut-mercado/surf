import { IconBarcode } from "@tabler/icons-react";
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBarcode />
        </EmptyMedia>
        <EmptyTitle>No SKUs Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any SKUs yet. Get started by creating your first SKU.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">Create SKU</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};


