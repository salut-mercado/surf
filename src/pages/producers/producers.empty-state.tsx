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

export const ProducersEmptyState = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconUserPlus />
        </EmptyMedia>
        <EmptyTitle>No Producers Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any producers yet. Get started by creating your
          first producer.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/producers/create">Create Producer</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};


