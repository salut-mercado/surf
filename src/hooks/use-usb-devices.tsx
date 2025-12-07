import {
  useQuery,
  type UndefinedInitialDataOptions,
} from "@tanstack/react-query";

export interface UsbDevice {
  product_id: number;
  vendor_id: number;
  name: string;
}

export const useUsbDevices = (
  options?: Omit<
    UndefinedInitialDataOptions<UsbDevice[], Error, UsbDevice[], string[]>,
    "queryKey" | "queryFn" | "initialData"
  >
) => {
  const data = useQuery({
    queryKey: ["usb", "devices"],
    queryFn: async () => {
      return fetch("http://localhost:8001/usb-devices").then(
        (res) => res.json() as Promise<UsbDevice[]>
      );
    },
    initialData: [],
    staleTime: 0,
    refetchInterval(data) {
      if (data.state.data !== null) {
        return false;
      }
      return 1000;
    },
    ...options,
  });

  return data;
};
