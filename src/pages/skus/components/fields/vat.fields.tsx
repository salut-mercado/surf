import { IconPencil } from "@tabler/icons-react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { FieldDescription } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

export const ALLOWED_VATS = [0, 4, 5, 10, 21] as const;

export const VatField = <T extends AnyFieldApi>({ field }: { field: T }) => {
  const [custom, setCustom] = useState(
    !ALLOWED_VATS.includes(field.state.value) || false
  );
  return (
    <>
      <Label htmlFor={field.name}>VAT (%)</Label>
      <div
        className={cn(
          "w-full grid gap-2",
          custom ? undefined : "md:grid-cols-2"
        )}
      >
        {!custom && (
          <>
            <VatPreset
              value={ALLOWED_VATS[0]}
              field={field}
              title="0% (temporal)"
              description="Staple food products, extended until end of 2025"
            />
            <VatPreset
              value={ALLOWED_VATS[1]}
              field={field}
              title="4% Superreducido"
              description="IVA Superreducido - Newspapers, books, prescription medicines"
            />
            <VatPreset
              value={ALLOWED_VATS[2]}
              field={field}
              title="5% Reducido"
              description="Oils and pasta, extended until end of 2025"
            />
            <VatPreset
              value={ALLOWED_VATS[3]}
              field={field}
              title="10% Reducido"
              description="Food, restaurants, hotels, transport, cultural events"
            />
            <VatPreset
              value={ALLOWED_VATS[4]}
              field={field}
              title="21% General"
              description="Base rate for most goods and services"
            />
          </>
        )}
        <VatPreset
          field={field}
          value={-1}
          title="Custom"
          description="Custom VAT rate"
          onClick={() =>
            setCustom((c) => {
              if (!c) {
                return !c;
              }
              if (ALLOWED_VATS.includes(field.state.value)) {
                return !c;
              }
              field.handleChange(0);
              return !c;
            })
          }
          isSelected={custom}
        />
      </div>

      <Input
        id={field.name}
        name={field.name}
        type="number"
        min={0}
        max={100}
        step="0.01"
        value={field.state.value ?? 0}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        className={custom ? undefined : "hidden"}
      />
      <FieldDescription>Value-added tax percent.</FieldDescription>
    </>
  );
};

const VatPreset = ({
  title,
  description,
  value,
  field,
  onClick,
  isSelected,
}: {
  value: number;
  field: AnyFieldApi;
  title: string;
  description: string;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  const selected = isSelected ?? value === field.state.value;
  return (
    <Button
      type="button"
      className={cn("h-auto flex gap-2 justify-start", {
        "border-transparent border": !selected,
      })}
      onClick={onClick ? onClick : () => field.handleChange(value)}
      variant={selected ? "outline" : "ghost"}
    >
      <span className="text-lg font-medium size-10 bg-secondary rounded-full flex items-center justify-center">
        {value === -1 ? <IconPencil className="size-4" /> : value}
        {value !== -1 && <span className="text-sm">%</span>}
      </span>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </Button>
  );
};
