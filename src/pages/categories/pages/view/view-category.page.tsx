import { skipToken } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { DashboardPage } from "~/components/dashboard-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/hooks/api";
import { Button } from "~/components/ui/button";

export default function ViewCategoryPage() {
  const params = useParams();
  const id = params?.id;
  const category = api.categories.useGetById(
    id ? { categoriesId: id } : skipToken
  );
  const data = category.data;

  return (
    <DashboardPage>
      <div className="flex gap-2 justify-between mb-2 items-center">
        <Button asChild variant="outline" size="icon-sm">
          <Link href="/">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/${id}/edit`}>Edit</Link>
        </Button>
      </div>
      {data && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{data.categoryName}</CardTitle>
            </div>
            <CardDescription>Category details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div>
                <span className="text-sm text-muted-foreground">ID</span>
                <div className="font-mono text-sm">{data.id}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Parent</span>
                <div className="text-sm">{data.parentCategoryId ?? "-"}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Level</span>
                <div className="text-sm">{data.level}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardPage>
  );
}
