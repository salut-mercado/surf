import type { ComponentProps } from "react";
import LogoIcon from "~/assets/logo-icon.svg?react";
import LogoFull from "~/assets/logo-full.svg?react";
import LogoText from "~/assets/logo-text.svg?react";
import { cn } from "~/lib/utils";

export const Logo = ({
  variant = "full",
  className,
  ...props
}: ComponentProps<"svg"> & { variant?: "icon" | "full" | "text" }) => {
  return variant === "icon" ? (
    <LogoIcon className={cn("size-8", className)} {...props} />
  ) : variant === "full" ? (
    <LogoFull className={cn("h-8 w-auto", className)} {...props} />
  ) : (
    <LogoText className={cn("h-5 w-auto", className)} {...props} />
  );
};
