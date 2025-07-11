import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { useForm } from "@tanstack/react-form";
import type { SupplierSchema } from "@salut-mercado/octo-client";

interface CreateSupplierFormProps {
  onSubmit: (data: SupplierSchema) => void;
  submitLabel?: string;
}

export function CreateSupplierForm({ onSubmit, submitLabel = "Create Supplier" }: CreateSupplierFormProps) {
  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      agent: "",
      phone: "",
      delayDays: 1,
      taxID: "",
      blocked: true,
      analytics: false,
      comments: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        code: value.code,
        name: value.name,
        agent: value.agent,
        phone: value.phone,
        delayDays: value.delayDays || 1,
        taxID: value.taxID,
        blocked: value.blocked,
        analytics: value.analytics,
        comments: value.comments || "",
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid gap-4">
        <form.Field
          name="code"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Code</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="taxID"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Tax ID</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
            </div>
          )}
        />
        <form.Field
          name="comments"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Comments</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="analytics"
          children={(field) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onBlur={field.handleBlur}
                onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
              />
              <Label htmlFor={field.name}>Analytics</Label>
            </div>
          )}
        />
        <form.Field
          name="blocked"
          children={(field) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onBlur={field.handleBlur}
                onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
              />
              <Label htmlFor={field.name}>Blocked</Label>
            </div>
          )}
        />
      </div>
      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {submitLabel}
          </Button>
        )}
      />
    </form>
  );
}

import type { SupplierWithId } from "./suppliersData";
import type { SupplierUpdateSchema } from "@salut-mercado/octo-client";

interface UpdateSupplierFormProps {
  onSubmit: (data: SupplierUpdateSchema) => void;
  initialValues: SupplierWithId;
  submitLabel?: string;
}

export function UpdateSupplierForm({ onSubmit, initialValues, submitLabel = "Update Supplier" }: UpdateSupplierFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      onSubmit({
        code: value.code,
        name: value.name,
        agent: value.agent,
        phone: value.phone,
        delayDays: value.delayDays,
        taxID: value.taxID,
        blocked: value.blocked,
        analytics: value.analytics,
        comments: value.comments,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid gap-4">
        <form.Field
          name="code"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Code</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="taxID"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Tax ID</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
            </div>
          )}
        />
        <form.Field
          name="comments"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Comments</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        <form.Field
          name="analytics"
          children={(field) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onBlur={field.handleBlur}
                onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
              />
              <Label htmlFor={field.name}>Analytics</Label>
            </div>
          )}
        />
        <form.Field
          name="blocked"
          children={(field) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onBlur={field.handleBlur}
                onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
              />
              <Label htmlFor={field.name}>Blocked</Label>
            </div>
          )}
        />
      </div>
      <form.Subscribe
        selector={(state) => state.canSubmit}
        children={(canSubmit) => (
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {submitLabel}
          </Button>
        )}
      />
    </form>
  );
} 