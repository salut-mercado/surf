import type { FirmsProducerSchema } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { FieldDescription } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { producerSchema } from "./producer.validator";

interface ProducerFormProps {
  onSubmit: (data: FirmsProducerSchema) => void;
  isSubmitting: boolean;
  initialValues?: FirmsProducerSchema;
  submitLabel?: string;
}

const defaultValues: FirmsProducerSchema = {
  name: "",
  nif: "",
  minimumStock: 0,
};

export function ProducerForm({
  onSubmit,
  initialValues = defaultValues,
  isSubmitting = false,
  submitLabel,
}: ProducerFormProps) {
  const { t } = useTranslation();
  const defaultSubmitLabel = t("producers.createProducer");
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      onSubmit({
        name: value.name,
        nif: value.nif,
        minimumStock: value.minimumStock,
      });
    },
    validators: {
      onChange: producerSchema,
      onMount: producerSchema,
      onBlur: producerSchema,
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
          name="name"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("producers.form.fields.name")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("producers.form.placeholders.name")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("producers.form.descriptions.name")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="nif"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("producers.form.fields.taxId")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={t("producers.form.placeholders.taxId")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                {t("producers.form.descriptions.taxId")}
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="minimumStock"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>
                {t("producers.form.fields.minimumStock")}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder={t("producers.form.placeholders.minimumStock")}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>
                {t("producers.form.descriptions.minimumStock")}
              </FieldDescription>
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
            {isSubmitting ? <Spinner /> : submitLabel ?? defaultSubmitLabel}
          </Button>
        )}
      />
    </form>
  );
}
