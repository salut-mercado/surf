import type { SupplierReturnSchema } from "@salut-mercado/octo-client";
import { useForm, type FormValidateOrFn } from "@tanstack/react-form";
import { UserCheck2Icon, UserX2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BooleanCards } from "~/components/ui/boolean-cards";
import { Button } from "~/components/ui/button";
import { FieldDescription } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { supplierSchema } from "./supplier.validator";

interface CreateSupplierFormProps {
  onSubmit: (data: SupplierReturnSchema) => void;
  isSubmitting: boolean;
  initialValues?: SupplierReturnSchema;
  submitLabel?: string;
}

const defaultValues = {
  id: "emptyid",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  code: "",
  name: "",
  agent: "",
  phone: "",
  delay_days: 1,
  nif: "",
  blocked: true,
  comments: "",
};

export function SupplierForm({
  onSubmit,
  initialValues = defaultValues,
  isSubmitting = false,
  submitLabel,
}: CreateSupplierFormProps) {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t("suppliers.createSupplier");
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      onSubmit({
        id: value.id,
        created_at: value.created_at,
        updated_at: value.updated_at,
        code: value.code,
        name: value.name,
        agent: value.agent,
        phone: value.phone,
        delay_days: value.delay_days,
        nif: value.nif,
        blocked: value.blocked,
        comments: value.comments,
      });
    },
    validators: {
      onChange: supplierSchema as FormValidateOrFn<SupplierReturnSchema>,
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
          name="code"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.code")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("suppliers.form.placeholders.code")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("suppliers.form.descriptions.code")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="name"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.name")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("suppliers.form.placeholders.name")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("suppliers.form.descriptions.name")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="agent"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.agent")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("suppliers.form.placeholders.agent")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("suppliers.form.descriptions.agent")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="phone"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.phone")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("suppliers.form.placeholders.phone")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("suppliers.form.descriptions.phone")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="nif"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.taxId")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("suppliers.form.placeholders.taxId")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("suppliers.form.descriptions.taxId")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="delay_days"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.delayDays")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder={t("suppliers.form.placeholders.delayDays")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>
                {t("suppliers.form.descriptions.delayDays")}
              </FieldDescription>
            </div>
          )}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-start">
        <form.Field
          name="comments"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.comments")}
              </Label>
              <Textarea
                id={field.name}
                name={field.name}
                placeholder={t("suppliers.form.placeholders.comments")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="blocked"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("suppliers.form.fields.blocked")}
              </Label>
              <BooleanCards
                value={field.state.value ? "true" : "false"}
                onChange={(val) => field.handleChange(val === "true")}
                options={[
                  {
                    value: "false",
                    title: t("suppliers.form.blockedOptions.active"),
                    description: t(
                      "suppliers.form.blockedOptions.activeDescription"
                    ),
                    icon: <UserCheck2Icon className="size-6" />,
                  },
                  {
                    value: "true",
                    title: t("suppliers.form.blockedOptions.blocked"),
                    description: t(
                      "suppliers.form.blockedOptions.blockedDescription"
                    ),
                    icon: <UserX2Icon className="size-6" />,
                  },
                ]}
              />
            </div>
          )}
        />
      </div>
      {/* <form.Field
            name="analytics"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Analytics</Label>
                <BooleanCards
                  value={field.state.value ? "true" : "false"}
                  onChange={(val) => field.handleChange(val === "true")}
                  options={[
                    {
                      icon: <IconChartBar className="size-6" />,
                      value: "true",
                      title: "Enabled",
                      description: "Collect usage analytics",
                    },
                    {
                      icon: <IconChartBarOff className="size-6" />,
                      value: "false",
                      title: "Disabled",
                      description: "Do not collect analytics",
                    },
                  ]}
                />
              </div>
            )}
          /> */}

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
