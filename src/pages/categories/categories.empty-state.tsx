import { IconFolderPlus } from "@tabler/icons-react";
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
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderPlus />
        </EmptyMedia>
        <EmptyTitle>No Categories Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any categories yet. Get started by creating your
          first category.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/create">Create Category</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};


