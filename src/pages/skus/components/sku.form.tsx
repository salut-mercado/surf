import type { SKUReturnSchema, SKUSchema } from "@salut-mercado/octo-client";
import { UnitMeasurementEnum } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import {
  Package,
  Ruler,
  DollarSign,
  Percent,
  FileText,
  BarcodeIcon,
  Save,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
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
import { orderCategories } from "~/lib/utils/order-categories";
import { VatField } from "./fields/vat.fields";

type SkuFormValues = SKUReturnSchema | (SKUSchema & { id?: string });

interface SkuFormProps {
  onSubmit: (data: SkuFormValues) => void;
  isSubmitting: boolean;
  initialValues?: Partial<SkuFormValues>;
  submitLabel?: string;
}

export function SkuForm({
  onSubmit,
  initialValues = {},
  isSubmitting = false,
  submitLabel,
}: SkuFormProps) {
  const { t } = useTranslation();

  const unitMeasurementOptions = [
    {
      value: UnitMeasurementEnum.unit,
      label: t("skus.form.unitMeasurement.unit"),
    },
    {
      value: UnitMeasurementEnum.gramm,
      label: t("skus.form.unitMeasurement.gramm"),
    },
    {
      value: UnitMeasurementEnum.milliliter,
      label: t("skus.form.unitMeasurement.milliliter"),
    },
  ];

  const defaultSubmitLabel = submitLabel ?? t("skus.saveSku");
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
    supplier_id: "",
    producer_id: "",
    category_id: "",
    // enums/numbers
    unit_measurement: UnitMeasurementEnum.unit,
    shelf_lifetime: 0,
    net_weight: 0,
    vat_percent: 0,
    alcohol_percent: 0,
    natural_loss_percent: 0,
    max_on_checkout: 0,
    // optionals
    specifications: "",
    barcode: "",
    wholesale_price: 0,
    retail_price_1: 0,
    retail_price_2: undefined,
  };

  const form = useForm({
    defaultValues: { ...defaultValues, ...initialValues },
    onSubmit: async ({ value }) => onSubmit(value as SkuFormValues),
    validators: {
      onChange: skuSchema,
    },
  });

  const initialId = initialValues?.id;

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
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-primary" />
            {t("skus.form.sections.basicInformation")}
          </CardTitle>
          <CardDescription>
            {t("skus.form.sections.basicInformationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <form.Field
              name="name"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.name")}*
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldDescription>
                    {t("skus.form.descriptions.name")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="barcode"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.barcode")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="8414227680716"
                      className="font-mono"
                    />
                    <CameraButton
                      title={t("skus.form.scanBarcode")}
                      buttonLabel=""
                      icon={BarcodeIcon}
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
                              "net_weight",
                              parseFloat(product.product.product_quantity)
                            );
                          }
                          if (product.product.product_quantity_unit) {
                            const product_quantity_unit =
                              product.product.product_quantity_unit;
                            if (product_quantity_unit === "g") {
                              form.setFieldValue(
                                "unit_measurement",
                                UnitMeasurementEnum.gramm
                              );
                            } else if (product_quantity_unit === "ml") {
                              form.setFieldValue(
                                "unit_measurement",
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

                  <FieldDescription>
                    {t("skus.form.descriptions.barcode")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <form.Field
              name="supplier_id"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.supplier")}*
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
                        placeholder={t("skus.form.placeholders.selectSupplier")}
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
                    {t("skus.form.descriptions.supplier")}
                  </FieldDescription>{" "}
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="producer_id"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.producer")}*
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
                        placeholder={t("skus.form.placeholders.selectProducer")}
                      />
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

                  <FieldDescription>
                    {t("skus.form.descriptions.producer")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="category_id"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.category")}*
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
                        placeholder={t("skus.form.placeholders.selectCategory")}
                      />
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
                            {c.category_name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    {t("skus.form.descriptions.category")}
                  </FieldDescription>{" "}
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Measurements & Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="h-5 w-5 text-primary" />
            {t("skus.form.sections.measurementsAndSpecifications")}
          </CardTitle>
          <CardDescription>
            {t("skus.form.sections.measurementsAndSpecificationsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <form.Field
              name="unit_measurement"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.unit")}*
                  </Label>
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
                      <SelectValue
                        placeholder={t("skus.form.placeholders.selectUnit")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {unitMeasurementOptions.map((u) => (
                        <SelectItem key={`unit-${u.value}`} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldDescription>
                    {t("skus.form.descriptions.unit")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="shelf_lifetime"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.shelfLifetime")}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    value={field.state.value ?? 0}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />

                  <FieldDescription>
                    {t("skus.form.descriptions.shelfLifetime")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="net_weight"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.netWeight")}
                  </Label>
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
                  <FieldDescription>
                    {t("skus.form.descriptions.netWeight")}
                  </FieldDescription>{" "}
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="max_on_checkout"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.maxOnCheckout")}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    value={field.state.value ?? 0}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />

                  <FieldDescription>
                    {t("skus.form.descriptions.maxOnCheckout")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            {t("skus.form.sections.pricing")}
          </CardTitle>
          <CardDescription>
            {t("skus.form.sections.pricingDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            <form.Field
              name="wholesale_price"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.wholesalePrice")}
                  </Label>
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
                  <FieldDescription>
                    {t("skus.form.descriptions.wholesalePrice")}
                  </FieldDescription>{" "}
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="retail_price_1"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.view.retailPrice1")}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    step="0.001"
                    value={field.state.value ?? 0}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />

                  <FieldDescription>
                    {t("skus.form.descriptions.retailPrice1")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="retail_price_2"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.view.retailPrice2")}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    step="0.001"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.valueAsNumber || undefined)
                    }
                  />

                  <FieldDescription>
                    {t("skus.form.descriptions.retailPrice2")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax & Percentages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Percent className="h-5 w-5 text-primary" />
            {t("skus.form.sections.taxAndPercentages")}
          </CardTitle>
          <CardDescription>
            {t("skus.form.sections.taxAndPercentagesDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form.Field
            name="vat_percent"
            children={(field) => (
              <div className="grid gap-4">
                <VatField field={field} />
              </div>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <form.Field
              name="alcohol_percent"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.alcoholPercent")}
                  </Label>
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

                  <FieldDescription>
                    {t("skus.form.descriptions.alcoholPercent")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />

            <form.Field
              name="natural_loss_percent"
              children={(field) => (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>
                    {t("skus.form.fields.naturalLossPercent")}
                  </Label>
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

                  <FieldDescription>
                    {t("skus.form.descriptions.naturalLossPercent")}
                  </FieldDescription>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {t("skus.form.sections.specifications")}
          </CardTitle>
          <CardDescription>
            {t("skus.form.sections.specificationsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Field
            name="specifications"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>
                  {t("skus.view.freeFormAttributes")}
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("skus.form.placeholders.specifications")}
                  className="min-h-[120px]"
                />
                <FieldError
                  errors={
                    field.state.meta.isTouched
                      ? field.state.meta.errors
                      : undefined
                  }
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <div className="flex items-center justify-end gap-3">
            {initialId && (
              <Link href={`~/skus/${initialId}`}>
                <Button type="button" variant="outline">
                  {t("skus.form.cancel")}
                </Button>
              </Link>
            )}
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  {t("skus.form.saving")}
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {defaultSubmitLabel}
                </>
              )}
            </Button>
          </div>
        )}
      />
    </form>
  );
}
