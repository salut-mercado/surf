import { IconUserPlus } from "@tabler/icons-react";
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconUserPlus />
        </EmptyMedia>
        <EmptyTitle>No Suppliers Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any suppliers yet. Get started by creating
          your first supplier.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">Create Supplier</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
