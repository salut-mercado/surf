import type { OrderInflowReturnScheme } from "@salut-mercado/octo-client";
import { OrderStatusEnum } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Combobox } from "~/components/ui/combobox";
import { FieldError } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import { NumberInput } from "~/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/hooks/api";

const editInflowSchema = z.object({
  items: z
    .array(
      z.object({
        sku_id: z.string().min(1, "SKU is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        warehouse_id: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
});

type EditInflowFormValues = z.infer<typeof editInflowSchema>;

interface EditInflowFormProps {
  inflow: OrderInflowReturnScheme;
  supplierName: string;
  onSubmit: (data: {
    items: EditInflowFormValues["items"];
    approve?: boolean;
  }) => void;
  isSubmitting: boolean;
}

const LabelText = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium">{children}</div>
);

export function EditInflowForm({
  inflow,
  supplierName,
  onSubmit,
  isSubmitting,
}: EditInflowFormProps) {
  const { t } = useTranslation();
  const isCreated = inflow.order_status === OrderStatusEnum.created;
  const isApproved = inflow.order_status === OrderStatusEnum.approved;

  const warehouses = api.warehouse.useGetAll({
    limit: 1000,
  });
  const skus = api.skus.useGetAll({
    limit: 1000,
  });

  const initialItems = (inflow.sku_order_inflow || []).map((item) => ({
    sku_id: item.sku_id,
    quantity: item.quantity || 1,
    warehouse_id: undefined as string | undefined, // warehouse_id is not stored in SKUOrderInflowReturnScheme
  }));

  const form = useForm({
    defaultValues: {
      items: initialItems,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: editInflowSchema as any,
    },
  });

  const skuOptions =
    !skus.data?.items || !inflow.supplier_id
      ? []
      : skus.data.items
          .filter((sku) => sku.supplier_id === inflow.supplier_id)
          .map((sku) => ({
            value: sku.id,
            label: `${sku.name}${sku.barcode ? ` (${sku.barcode})` : ""}`,
          }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Inflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <LabelText>Supplier</LabelText>
            <div className="text-muted-foreground">{supplierName}</div>
          </div>
          <div className="space-y-2">
            <LabelText>Store ID</LabelText>
            <div className="text-muted-foreground">{inflow.store_id}</div>
          </div>
          <div className="space-y-2">
            <LabelText>Current Status</LabelText>
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

        {isCreated && (
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <LabelText>{t("inflows.form.fields.items")}*</LabelText>
              <form.Field
                name="items"
                children={(field) => {
                  const firstWarehouseId = warehouses.data?.pages
                    .flatMap((p) => p.items || [])
                    .filter((w) => w && w.id)[0]?.id;
                  return (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.pushValue({
                          sku_id: "",
                          quantity: 1,
                          warehouse_id: firstWarehouseId,
                        });
                      }}
                    >
                      <PlusIcon className="size-4 mr-2" />
                      {t("inflows.form.addItem")}
                    </Button>
                  );
                }}
              />
            </div>

            <form.Field
              name="items"
              children={(field) => (
                <div className="space-y-4">
                  {field.state.value.map(
                    (
                      item: {
                        sku_id: string;
                        quantity: number;
                        warehouse_id?: string;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4 bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 grid gap-4 md:grid-cols-3">
                            {/* SKU Selection */}
                            <div className="grid gap-2">
                              <Label>{t("inflows.form.fields.sku")}*</Label>
                              <Combobox
                                values={skuOptions}
                                value={
                                  skuOptions.find(
                                    (opt) => opt.value === item.sku_id
                                  ) || null
                                }
                                onValueChange={(selected) => {
                                  field.replaceValue(index, {
                                    ...item,
                                    sku_id: selected?.value || "",
                                    warehouse_id:
                                      item.warehouse_id || undefined,
                                  });
                                }}
                                placeholder={t(
                                  "inflows.form.placeholders.selectSku"
                                )}
                              />
                              <FieldError
                                errors={
                                  field.state.meta.errors?.[index] &&
                                  typeof field.state.meta.errors[index] ===
                                    "object" &&
                                  "sku_id" in field.state.meta.errors[index]
                                    ? [
                                        {
                                          message: String(
                                            (
                                              field.state.meta.errors[
                                                index
                                              ] as {
                                                sku_id?: string;
                                              }
                                            ).sku_id
                                          ),
                                        },
                                      ]
                                    : undefined
                                }
                              />
                            </div>

                            {/* Quantity */}
                            <div className="grid gap-2">
                              <Label>
                                {t("inflows.form.fields.quantity")}*
                              </Label>
                              <NumberInput
                                value={item.quantity}
                                onValueChange={(val) => {
                                  field.replaceValue(index, {
                                    ...item,
                                    quantity: val ?? 1,
                                    warehouse_id:
                                      item.warehouse_id || undefined,
                                  });
                                }}
                                min={1}
                              />
                              <FieldError
                                errors={
                                  field.state.meta.errors?.[index] &&
                                  typeof field.state.meta.errors[index] ===
                                    "object" &&
                                  "quantity" in field.state.meta.errors[index]
                                    ? [
                                        {
                                          message: String(
                                            (
                                              field.state.meta.errors[
                                                index
                                              ] as {
                                                quantity?: string;
                                              }
                                            ).quantity
                                          ),
                                        },
                                      ]
                                    : undefined
                                }
                              />
                            </div>

                            {/* Warehouse (Optional) */}
                            <div className="grid gap-2">
                              <Label>
                                {t("inflows.form.fields.warehouse")}
                              </Label>
                              <Select
                                value={item.warehouse_id ?? undefined}
                                onValueChange={(val) => {
                                  field.replaceValue(index, {
                                    ...item,
                                    warehouse_id: val || undefined,
                                  });
                                }}
                              >
                                <SelectTrigger
                                  disabled={
                                    warehouses.data?.pages
                                      .flatMap((p) => p.items || [])
                                      .filter((w) => w && w.id).length === 1
                                  }
                                >
                                  <SelectValue
                                    placeholder={t(
                                      "inflows.form.placeholders.selectWarehouse"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {warehouses.data?.pages
                                    .flatMap((p) => p.items || [])
                                    .filter((w) => w && w.id)
                                    .map((w) => (
                                      <SelectItem
                                        key={`wh-${w.id}`}
                                        value={w.id}
                                      >
                                        {w.address}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              field.removeValue(index);
                            }}
                            className="mt-6"
                          >
                            <TrashIcon className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )
                  )}

                  {field.state.value.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {t("inflows.form.noItems")}
                    </div>
                  )}

                  <FieldError
                    errors={
                      field.state.meta.isTouched && field.state.meta.errors
                        ? Array.isArray(field.state.meta.errors)
                          ? field.state.meta.errors
                          : [{ message: String(field.state.meta.errors) }]
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Subscribe
              selector={(state) => state.canSubmit}
              children={(canSubmit) => (
                <Button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await form.handleSubmit();
                  }}
                  className="w-full"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner />
                  ) : (
                    t("inflows.form.updateInflow", "Update Inflow")
                  )}
                </Button>
              )}
            />
          </div>
        )}

        {!isApproved && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => {
                onSubmit({ items: form.state.values.items, approve: true });
              }}
              disabled={isSubmitting}
              variant={isCreated ? "outline" : "default"}
            >
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
