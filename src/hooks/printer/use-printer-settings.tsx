import { useQuery } from "@tanstack/react-query";

type PrinterSettings = {
  vendor_id: number;
  product_id: number;
};

export const usePrinterSettings = (): [
  settings: PrinterSettings | null | undefined,
  updater: (settings: PrinterSettings) => void,
] => {
  const { data: printerSettings } = useQuery({
    queryKey: ["printer", "settings"],
    queryFn: () =>
      fetch("http://localhost:8001/settings").then((res) => res.json()),
    refetchInterval: 1000,
    staleTime: 0,
    enabled(query) {
      return  query.state.data == null;
    },
  });
  const updater = (settings: PrinterSettings) => {
    fetch("http://localhost:8001/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });
  };
  return [
    printerSettings as PrinterSettings | null | undefined,
    updater as (settings: PrinterSettings) => void,
  ] as const;
};
