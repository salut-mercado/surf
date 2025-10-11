import type React from "react";
import { cn } from "~/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

type CardOption = {
  value: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

interface BooleanCardsProps {
  value: string;
  onChange: (value: string) => void;
  options: CardOption[];
  className?: string;
  disabled?: boolean;
  variant?: "outline" | "default";
}

function BooleanCards({
  value,
  onChange,
  options,
  className,
  disabled,
  variant = "default",
}: BooleanCardsProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (!val) return; // ignore deselect in single mode
        onChange(val);
      }}
      className={cn("w-full", className)}
      variant={variant}
      disabled={disabled}
      aria-label="Toggle option"
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          aria-label={opt.title}
          className="h-auto"
        >
          <div className="grid place-items-center py-2 gap-1">
            {opt.icon && (
              <div className="text-muted-foreground">{opt.icon}</div>
            )}
            <span>{opt.title}</span>
            {opt.description && (
              <div className="text-muted-foreground text-xs leading-snug">
                {opt.description}
              </div>
            )}
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export { BooleanCards };
