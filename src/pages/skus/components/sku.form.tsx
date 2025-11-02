import type { SKUReturnSchema, SKUSchema } from "@salut-mercado/octo-client";
import { UnitMeasurementEnum } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { FieldDescription, FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/hooks/api";
import { skuSchema } from "./sku.validator";
import { CameraButton } from "~/components/composite/camera-button";
import { IconBarcode } from "@tabler/icons-react";
import { orderCategories } from "~/lib/utils/order-categories";
import { VatField } from "./fields/vat.fields";

type SkuFormValues = SKUReturnSchema | (SKUSchema & { id?: string });

interface SkuFormProps {
  onSubmit: (data: SkuFormValues) => void;
  isSubmitting: boolean;
  initialValues?: Partial<SkuFormValues>;
  submitLabel?: string;
}

const unitMeasurementOptions = [
  { value: UnitMeasurementEnum.unit, label: "Unit" },
  { value: UnitMeasurementEnum.gramm, label: "Gramm" },
  { value: UnitMeasurementEnum.milliliter, label: "Milliliter" },
];

export function SkuForm({
  onSubmit,
  initialValues = {},
  isSubmitting = false,
  submitLabel = "Save SKU",
}: SkuFormProps) {
  const producers = api.producers.useGetAll({
    limit: 1000,
  });
  const suppliers = api.suppliers.useGetAll({
    limit: 1000,
  });
  const categories = api.categories.useGetAll({
    limit: 1000,
  });
  const { mutateAsync: getProductByBarcode } =
    api.openfoodfacts.useGetProductByBarcode();

  const defaultValues: SkuFormValues = {
    // required  ids
    name: "",
    supplierId: "",
    producerId: "",
    categoryId: "",
    // enums/numbers
    unitMeasurement: UnitMeasurementEnum.unit,
    shelfLifetime: 0,
    netWeight: 0,
    vatPercent: 0,
    alcoholPercent: 0,
    naturalLossPercent: 0,
    maxOnCheckout: 0,
    // optionals
    specifications: "",
    barcode: "",
    wholesalePrice: 0,
  };

  const form = useForm({
    defaultValues: { ...defaultValues, ...initialValues },
    onSubmit: async ({ value }) => onSubmit(value as SkuFormValues),
    validators: {
      onChange: skuSchema,
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
      className="space-y-4"
      aria-disabled={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <form.Field
          name="name"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Name*</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>
                Product name displayed across the app.
              </FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="supplierId"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Supplier*</Label>
              <Select
                value={field.state.value ?? ""}
                onValueChange={(v) => field.handleChange(v)}
                onOpenChange={(open) => {
                  if (!open) field.handleBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Supplier" />
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
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>Supplier providing this SKU.</FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="producerId"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Producer*</Label>
              <Select
                value={field.state.value ?? ""}
                onValueChange={(v) => field.handleChange(v)}
                onOpenChange={(open) => {
                  if (!open) field.handleBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Producer" />
                </SelectTrigger>
                <SelectContent>
                  {(producers.data || [])
                    .filter((p) => p && p.id)
                    .map((p) => (
                      <SelectItem key={`prod-${p.id}`} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>Producer or manufacturer.</FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="categoryId"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Category*</Label>
              <Select
                value={field.state.value ?? ""}
                onValueChange={(v) => field.handleChange(v)}
                onOpenChange={(open) => {
                  if (!open) field.handleBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {orderCategories(
                    (categories.data || []).filter((c) => c && c.id)
                  ).map((c) => (
                    <SelectItem key={`cat-${c.id}`} value={c.id}>
                      <span
                        style={{
                          paddingLeft: 8 * c.level,
                          display: "inline-block",
                        }}
                      >
                        {c.categoryName}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>
                Classification/category for the SKU.
              </FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="unitMeasurement"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Unit*</Label>
              <Select
                value={field.state.value ?? UnitMeasurementEnum.unit}
                onValueChange={(v) =>
                  field.handleChange(v as UnitMeasurementEnum)
                }
                onOpenChange={(open) => {
                  if (!open) field.handleBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitMeasurementOptions.map((u) => (
                    <SelectItem key={`unit-${u.value}`} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>
                Measurement unit used for this SKU.
              </FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="shelfLifetime"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Shelf Lifetime (days)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                value={field.state.value ?? 0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>
                How many days the item can be stored.
              </FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="netWeight"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Net Weight</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                step="0.01"
                value={field.state.value ?? 0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>Weight excluding packaging.</FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="alcoholPercent"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Alcohol (%)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={field.state.value ?? 0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>Alcohol by volume percent.</FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="vatPercent"
          children={(field) => (
            <div className="grid gap-2 md:col-span-2">
              <VatField field={field} />
            </div>
          )}
        />

        <form.Field
          name="naturalLossPercent"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Natural Loss (%)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={field.state.value ?? 0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>
                Expected natural loss percent.
              </FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="maxOnCheckout"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Max on Checkout</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                value={field.state.value ?? 0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>
                Maximum quantity allowed per order.
              </FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="barcode"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Barcode</Label>
              <div className="flex gap-2">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <CameraButton
                  title="Scan Barcode"
                  buttonLabel=""
                  icon={IconBarcode}
                  autoCloseOnBarcodeDetected
                  onBarcodeDetected={async (barcodes) => {
                    field.handleChange(barcodes[0].rawValue);
                    const product = await getProductByBarcode(
                      barcodes[0].rawValue
                    );
                    if (product) {
                      if (product.product.product_name) {
                        form.setFieldValue(
                          "name",
                          product.product.product_name
                        );
                      }
                      if (product.product.ingredients_text_es) {
                        form.setFieldValue(
                          "specifications",
                          product.product.ingredients_text_es
                        );
                      }
                      if (product.product.product_quantity) {
                        form.setFieldValue(
                          "netWeight",
                          parseFloat(product.product.product_quantity)
                        );
                      }
                      if (product.product.product_quantity_unit) {
                        const product_quantity_unit =
                          product.product.product_quantity_unit;
                        if (product_quantity_unit === "g") {
                          form.setFieldValue(
                            "unitMeasurement",
                            UnitMeasurementEnum.gramm
                          );
                        } else if (product_quantity_unit === "ml") {
                          form.setFieldValue(
                            "unitMeasurement",
                            UnitMeasurementEnum.milliliter
                          );
                        }
                      }
                    }
                  }}
                  barcodeFormats={["ean_13", "ean_8", "upc_a", "upc_e"]}
                  size="icon"
                  scanInterval={200}
                  variant="outline"
                />
              </div>
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>Barcode (EAN/UPC).</FieldDescription>
            </div>
          )}
        />

        <form.Field
          name="wholesalePrice"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Wholesale Price</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={0}
                step="0.00001"
                value={field.state.value ?? 0}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldError
                errors={
                  field.state.meta.isTouched
                    ? field.state.meta.errors
                    : undefined
                }
              />
              <FieldDescription>Base wholesale unit price.</FieldDescription>
            </div>
          )}
        />
      </div>

      <form.Field
        name="specifications"
        children={(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Specifications</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="min-h-[100px]"
            />
            <FieldError
              errors={
                field.state.meta.isTouched ? field.state.meta.errors : undefined
              }
            />
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? <Spinner /> : submitLabel}
          </Button>
        )}
      />
    </form>
  );
}
