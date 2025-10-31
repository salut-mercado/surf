import type { StoreReturnSchema } from "@salut-mercado/octo-client";
import { useForm } from "@tanstack/react-form";
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
  submitLabel = "Create Store",
}: StoreFormProps) {
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
              <Label htmlFor={field.name}>Address</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="123 Main St"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Store physical address.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="legalEntity"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Legal Entity</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Legal Company Name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Registered business name.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="price"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Price</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>Store pricing value.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="ip"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>IP Address</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="192.168.1.1"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Store network IP.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="salesArea"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Sales Area (m²)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>Sales floor area.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="totalArea"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Total Area (m²)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                placeholder="0.00"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              <FieldDescription>Total store area.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="dateOfFirstSale"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>First Sale Date</Label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Date of first sale.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="workingHours"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Working Hours</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="9:00-18:00"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Store operating hours.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="claster"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Cluster</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="A"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Store cluster classification.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="contacts"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Contacts</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="contact@store.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Contact information.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="assortmentMatrix"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Assortment Matrix</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Matrix ID"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Product assortment reference.</FieldDescription>
            </div>
          )}
        />
        <form.Field
          name="serviceProvider"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Service Provider</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Provider Name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldDescription>Service provider name.</FieldDescription>
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
