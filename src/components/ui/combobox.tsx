"use client";

import * as React from "react";

import { useMediaQuery } from "~/hooks/use-media-query";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type Value = {
  value: string;
  label: string;
};

export function Combobox({
  values,
  onValueChange,
  value,
  disabled,
  placeholder,
}: {
  values: Value[];
  value: Value | null;
  onValueChange: (value: Value | null) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedValue = value ?? null;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedValue ? <>{selectedValue.label}</> : <>{placeholder}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ComboboxList
            setOpen={setOpen}
            onValueChange={onValueChange}
            values={values}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedValue ? <>{selectedValue.label}</> : <>{placeholder}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ComboboxList
            setOpen={setOpen}
            onValueChange={onValueChange}
            values={values}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ComboboxList({
  setOpen,
  onValueChange: setSelectedValue,
  values,
}: {
  setOpen: (open: boolean) => void;
  onValueChange: (value: Value | null) => void;
  values: Value[];
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter ..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {values.map((v) => (
            <CommandItem
              key={v.value}
              value={v.value}
              onSelect={() => {
                setSelectedValue(v);
                setOpen(false);
              }}
            >
              {v.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
