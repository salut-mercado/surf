import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { useForm } from "@tanstack/react-form";
// import type { SuppliersSchema } from "@salut-mercado/octo-client";
import type { UpdateSuppliers } from "./use-create-supplier";
import type { SuppliersTableData } from "./suppliers-table";

interface CreateSupplierFormProps {
  onSubmit: (data: SuppliersTableData | UpdateSuppliers) => void;
  initialValues?: SuppliersTableData;
  submitLabel?: string;
}

// const randomString = () => {
//   return Math.random().toString(36).substring(2, 15);
// };

export function CreateSupplierForm({ onSubmit, initialValues, submitLabel = "Create Supplier" }: CreateSupplierFormProps) {
  const form = useForm({
    defaultValues: initialValues || {
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
      // console.log('Form values before submission:', value);
      onSubmit({
        code: value.code,
        name: value.name,
        agent: value.agent ,
        phone: value.phone ,
        delayDays: value.delayDays || 1,
        taxID: value.taxID,
        blocked: value.blocked,
        analytics: value.analytics,
        comments: value.comments || "",
      });
      // console.log('Data being sent to server:', {
      //   code: value.code,
      //   name: value.name,
      //   agent: value.agent,
      //   phone: value.phone,
      //   delayDays: value.delayDays || 1,
      //   taxID: value.taxID,
      //   blocked: value.blocked,
      //   analytics: value.analytics,
      //   comments: value.comments || "",
      // });
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