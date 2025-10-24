import type { SupplierReturnSchema } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
import { UserCheck2Icon, UserX2Icon } from "lucide-react";
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

const defaultValues: SupplierReturnSchema = {
  id: "emptyid",
  createdAt: new Date(),
  updatedAt: new Date(),
  code: "",
  name: "",
  agent: "",
  phone: "",
  delayDays: 1,
  nif: "",
  blocked: true,
  comments: "",
};

export function SupplierForm({
  onSubmit,
  initialValues = defaultValues,
  isSubmitting = false,
  submitLabel = "Create Supplier",
}: CreateSupplierFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      onSubmit({
        id: value.id,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        code: value.code,
        name: value.name,
        agent: value.agent,
        phone: value.phone,
        delayDays: value.delayDays,
        nif: value.nif,
        blocked: value.blocked,
        comments: value.comments,
      });
    },
    validators: {
      onChange: supplierSchema,
      onMount: supplierSchema,
      onBlur: supplierSchema,
    }
  });

  console.log("form.state.values", form.state.values);
  console.log("form.state.errors", form.state.errors);

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
              <Label htmlFor={field.name}>Code</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="SUP-001"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                Unique supplier code for quick lookup.
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="name"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Acme Supplies"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Supplier display name.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="agent"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Agent</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Jane Doe"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                Primary contact person at the supplier.
              </FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="phone"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Phone</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="+1 555 123 4567"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>
                Contact phone incl. country code.
              </FieldDescription>
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
          name="delayDays"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Delay Days</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                placeholder="30"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>
                Default payment delay in days.
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
              <Label htmlFor={field.name}>Comments</Label>
              <Textarea
                id={field.name}
                name={field.name}
                placeholder="Add any internal notes..."
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
              <Label htmlFor={field.name}>Blocked</Label>
              <BooleanCards
                value={field.state.value ? "true" : "false"}
                onChange={(val) => field.handleChange(val === "true")}
                options={[
                  {
                    value: "false",
                    title: "Active",
                    description: "Supplier is usable",
                    icon: <UserCheck2Icon className="size-6" />,
                  },
                  {
                    value: "true",
                    title: "Blocked",
                    description: "Prevent new transactions",
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
            {isSubmitting ? <Spinner /> : submitLabel}
          </Button>
        )}
      />
    </form>
  );
}
