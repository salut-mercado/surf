import type { StoreReturnSchema } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { FieldDescription } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { storeSchema } from "./store.validator";

interface StoreFormProps {
  onSubmit: (data: StoreReturnSchema) => void;
  isSubmitting: boolean;
  initialValues?: StoreReturnSchema;
  submitLabel?: string;
}

const defaultValues: StoreReturnSchema = {
  id: "emptyid",
  createdAt: new Date(),
  updatedAt: new Date(),
  address: "",
  legalEntity: "",
  price: 0,
  ip: "",
  salesArea: 0,
  totalArea: 0,
  dateOfFirstSale: "",
  workingHours: "",
  claster: "",
  contacts: "",
  assortmentMatrix: "",
  serviceProvider: "",
};

export function StoreForm({
  onSubmit,
  initialValues = defaultValues,
  isSubmitting = false,
  submitLabel,
}: StoreFormProps) {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel ?? t("stores.createStore");
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      onSubmit({
        id: value.id,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        address: value.address,
        legalEntity: value.legalEntity,
        price: value.price,
        ip: value.ip,
        salesArea: value.salesArea,
        totalArea: value.totalArea,
        dateOfFirstSale: value.dateOfFirstSale,
        workingHours: value.workingHours,
        claster: value.claster,
        contacts: value.contacts,
        assortmentMatrix: value.assortmentMatrix,
        serviceProvider: value.serviceProvider,
      });
    },
    validators: {
      onChange: storeSchema,
      onMount: storeSchema,
      onBlur: storeSchema,
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field
          name="address"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.address")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.address")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.address")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="legalEntity"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.legalEntity")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.legalEntity")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.legalEntity")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="price"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.price")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                placeholder={t("stores.form.placeholders.price")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>{t("stores.form.descriptions.price")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="ip"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.ip")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.ip")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.ip")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="salesArea"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.salesArea")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                placeholder={t("stores.form.placeholders.salesArea")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>{t("stores.form.descriptions.salesArea")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="totalArea"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.totalArea")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                placeholder={t("stores.form.placeholders.totalArea")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>{t("stores.form.descriptions.totalArea")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="dateOfFirstSale"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.dateOfFirstSale")}</Label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.dateOfFirstSale")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="workingHours"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.workingHours")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.workingHours")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.workingHours")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="claster"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.claster")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.claster")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.claster")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="contacts"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.contacts")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.contacts")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.contacts")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="assortmentMatrix"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.assortmentMatrix")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.assortmentMatrix")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.assortmentMatrix")}</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="serviceProvider"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>{t("stores.form.fields.serviceProvider")}</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("stores.form.placeholders.serviceProvider")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>{t("stores.form.descriptions.serviceProvider")}</FieldDescription>
            </div>
          )}
        />
      </div>

      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? <Spinner /> : defaultSubmitLabel}
          </Button>
        )}
      />
    </form>
  );
}
