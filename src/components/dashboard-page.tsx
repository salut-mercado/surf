import type { PropsWithChildren } from "react";

export const DashboardPage = ({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) => {
  return (
    <div className="flex flex-col px-4 lg:px-6 py-4">
      {title && <span className="text-lg font-bold mb-2">{title}</span>}
      {children}
    </div>
  );
};
