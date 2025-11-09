import * as React from "react";

import { Input } from "./input";

function NumberInput({
  onValueChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
  onValueChange: (value: number) => void;
}) {
  return (
    <Input
      type="number"
      onChange={(e) => {
        const valueAsNumber = e.target.valueAsNumber;
        if (Number.isNaN(valueAsNumber)) {
          onValueChange(0);
        } else {
          onValueChange(valueAsNumber);
          e.target.value = valueAsNumber.toString();
        }
      }}
      {...props}
    />
  );
}

export { NumberInput };
