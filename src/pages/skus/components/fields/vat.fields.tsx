import type { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FieldDescription, FieldError } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupNumberInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export const ALLOWED_VATS = [0, 4, 5, 10, 21] as const;

export const VatField = <T extends AnyFieldApi>({ field }: { field: T }) => {
  const { t } = useTranslation();
  const currentValue = field.state.value ?? 0;
  const [isCustom, setIsCustom] = useState(
    !ALLOWED_VATS.includes(currentValue as (typeof ALLOWED_VATS)[number])
  );
  const [customValue, setCustomValue] = useState(currentValue);

  return (
    <>
      <Label>{t("skus.form.vat.title")}*</Label>
      <RadioGroup
        value={String(currentValue)}
        onValueChange={(v) => {
          if (v === "custom") {
            field.handleChange(customValue);
            setIsCustom(true);
            return;
          }
          setIsCustom(false);
          field.handleChange(Number.parseFloat(v));
          setCustomValue(Number.parseFloat(v));
        }}
        className="grid gap-3"
      >
        {ALLOWED_VATS.map((option) => (
          <div key={option} className="flex items-start gap-3">
            <RadioGroupItem
              value={String(option)}
              id={`vat-${option}`}
              className="mt-1"
            />
            <div className="grid gap-0.5 flex-1">
              <Label
                htmlFor={`vat-${option}`}
                className="font-medium cursor-pointer"
              >
                {t(`skus.form.vat.presets.${option}.title`)}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t(`skus.form.vat.presets.${option}.description`)}
              </p>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-3">
          <RadioGroupItem
            value={String(isCustom ? (field.state.value ?? 0) : "custom")}
            id="vat-custom"
            className="mt-1"
            onClick={() => setIsCustom(true)}
          />
          <div className="grid gap-2 flex-1">
            <Label htmlFor="vat-custom" className="font-medium cursor-pointer">
              {t("skus.form.vat.custom")}
            </Label>
            {isCustom && (
              <>
                <InputGroup className="max-w-24">
                  <InputGroupNumberInput
                    id="vat-custom"
                    min="0"
                    max="100"
                    step="0.1"
                    value={customValue}
                    onValueChange={field.handleChange}
                    placeholder={t("skus.form.vat.customDescription")}
                  />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
                <FieldError
                  errors={
                    field.state.meta.isTouched
                      ? field.state.meta.errors
                      : undefined
                  }
                />
              </>
            )}
            {!isCustom && (
              <p className="text-sm text-muted-foreground">
                {t("skus.form.vat.customDescription")}
              </p>
            )}
          </div>
        </div>
      </RadioGroup>
      <FieldDescription>{t("skus.form.descriptions.vat")}</FieldDescription>
    </>
  );
};
