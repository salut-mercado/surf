import type { FirmsProducerSchema } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
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
  submitLabel = "Create Producer",
}: ProducerFormProps) {
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
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Producer name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Producer display name.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="nif"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Tax ID</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="PT123456789"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Tax ID (NIF/VAT).</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="minimumStock"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Minimum Stock</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>
                Required minimum stock for this producer.
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
            {isSubmitting ? <Spinner /> : submitLabel}
          </Button>
        )}
      />
    </form>
  );
}
