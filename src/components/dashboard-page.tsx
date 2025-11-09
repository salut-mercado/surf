import type { ComponentProps, PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

export const DashboardPage = ({
  title,
  children,
  className,
  ...props
}: PropsWithChildren<{ title?: string }> & ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col px-4 lg:px-6 py-4", className)}
      {...props}
    >
      {title && <span className="text-lg font-bold mb-2">{title}</span>}
      {children}
    </div>
  );
};
