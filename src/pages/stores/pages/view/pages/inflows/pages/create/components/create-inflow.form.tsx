import { useForm, type FormValidateOrFn } from "@tanstack/react-form";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Combobox } from "~/components/ui/combobox";
import { Button } from "~/components/ui/button";
import { FieldDescription, FieldError } from "~/components/ui/field";
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
import {
  createInflowSchema,
  type CreateInflowFormValues,
} from "./create-inflow.validator";

interface CreateInflowFormProps {
  onSubmit: (data: CreateInflowFormValues) => void;
  isSubmitting: boolean;
}

const defaultValues: CreateInflowFormValues = {
  supplier_id: "",
  items: [],
};

export function CreateInflowForm({
  onSubmit,
  isSubmitting = false,
}: CreateInflowFormProps) {
  const { t } = useTranslation();
  const suppliers = api.suppliers.useGetAll({
    limit: 1000,
  });
  const warehouses = api.warehouse.useGetAll({
    limit: 1000,
  });
  const skus = api.skus.useGetAll({
    limit: 1000,
  });

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validators: {
      onChange: createInflowSchema as FormValidateOrFn<CreateInflowFormValues>,
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
      className="space-y-6"
      aria-disabled={isSubmitting}
    >
      {/* Supplier Selection */}
      <form.Field
        name="supplier_id"
        children={(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>
              {t("inflows.form.fields.supplier")}*
            </Label>
            <Select
              value={field.state.value ?? ""}
              onValueChange={(v) => field.handleChange(v)}
              onOpenChange={(open) => {
                if (!open) field.handleBlur();
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("inflows.form.placeholders.selectSupplier")}
                />
              </SelectTrigger>
              <SelectContent>
                {suppliers.data?.pages
                  .flatMap((p) => p.items || [])
                  .filter((s) => s && s.id)
                  .map((s) => (
                    <SelectItem key={`sup-${s.id}`} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FieldDescription>
              {t("inflows.form.descriptions.supplier")}
            </FieldDescription>
            <FieldError
              errors={
                field.state.meta.isTouched ? field.state.meta.errors : undefined
              }
            />
          </div>
        )}
      />

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{t("inflows.form.fields.items")}*</Label>
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
                      warehouse_id: firstWarehouseId || undefined,
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

        <form.Subscribe
          selector={(state) => state.values.supplier_id}
          children={(supplierId) => {
            const skuOptions =
              !skus.data?.items || !supplierId
                ? []
                : skus.data.items
                    .filter((sku) => sku.supplier_id === supplierId)
                    .map((sku) => ({
                      value: sku.id,
                      label: `${sku.name}${sku.barcode ? ` (${sku.barcode})` : ""}`,
                    }));

            return (
              <form.Field
                name="items"
                children={(field) => (
                  <div className="space-y-4">
                {field.state.value.map((item, index) => (
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
                              });
                            }}
                            placeholder={
                              supplierId
                                ? t("inflows.form.placeholders.selectSku")
                                : t("inflows.form.placeholders.selectSupplierFirst")
                            }
                            disabled={!supplierId}
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
                                        field.state.meta.errors[index] as {
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
                        <Label>{t("inflows.form.fields.quantity")}*</Label>
                        <NumberInput
                          value={item.quantity}
                          onValueChange={(val) => {
                            field.replaceValue(index, {
                              ...item,
                              quantity: val ?? 1,
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
                                        field.state.meta.errors[index] as {
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
                        <Label>{t("inflows.form.fields.warehouse")}</Label>
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
                                <SelectItem key={`wh-${w.id}`} value={w.id}>
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
              ))}

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
            );
          }}
        />
      </div>

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? <Spinner /> : t("inflows.form.createInflow")}
          </Button>
        )}
      />
    </form>
  );
}
