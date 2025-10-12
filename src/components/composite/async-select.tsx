import type { UseQueryResult } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import type React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupSelectTrigger,
  InputGroupText,
} from "../ui/input-group";

interface AsyncSelectProps<
  TRawData extends object,
  TTransformedData extends { label: string; value: string },
  TQuery extends UseQueryResult<TRawData, Error> = UseQueryResult<
    TRawData,
    Error
  >,
> extends React.ComponentProps<typeof Select> {
  query: TQuery;
  transformOption: (option: TRawData) => TTransformedData[];
  renderOption?: (option: TTransformedData) => React.ReactNode;
  placeholder?: string;
}

export const AsyncSelect = <
  TRawData extends object,
  TTransformedData extends { label: string; value: string },
>({
  query,
  transformOption,
  renderOption,
  placeholder,
  ...props
}: AsyncSelectProps<TRawData, TTransformedData>) => {
  const { data, isLoading, isError } = query;
  const options = data ? transformOption(data) : [];
  return (
    <InputGroup>
      <Select {...props} disabled={isLoading || isError || props.disabled}>
        <InputGroupSelectTrigger
          data-loading={isLoading}
          data-errored={isError}
        >
          <SelectValue placeholder={placeholder}/>
        </InputGroupSelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {renderOption ? renderOption(option) : option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isLoading && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>
            <Spinner />
          </InputGroupText>
        </InputGroupAddon>
      )}
      {isError && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>
            <AlertTriangleIcon className="size-4 text-destructive" />
          </InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};
