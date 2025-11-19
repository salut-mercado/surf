import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { OrderInflowBaseReturnScheme } from "@salut-mercado/octo-client";

interface EditInflowFormProps {
  inflow: OrderInflowBaseReturnScheme;
  supplierName: string;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium">{children}</div>
);

export function EditInflowForm({
  inflow,
  supplierName,
  onSubmit,
  isSubmitting,
}: EditInflowFormProps) {
  const isApproved = inflow.order_status === OrderStatusEnum.approved;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Inflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <div className="text-muted-foreground">{supplierName}</div>
          </div>
          <div className="space-y-2">
            <Label>Store ID</Label>
            <div className="text-muted-foreground">{inflow.store_id}</div>
          </div>
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div>
              <Badge
                variant={
                  isApproved
                    ? "default"
                    : inflow.order_status === OrderStatusEnum.created
                      ? "secondary"
                      : "outline"
                }
              >
                {inflow.order_status}
              </Badge>
            </div>
          </div>
        </div>

        {!isApproved && (
          <div className="pt-4 border-t">
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Approve Inflow"}
            </Button>
          </div>
        )}

        {isApproved && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              This inflow is already approved and cannot be modified.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

