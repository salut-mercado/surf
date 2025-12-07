import { IconBarcode } from "@tabler/icons-react";
import { useState } from "react";
import { AsyncSelect } from "~/components/composite/async-select";
import { CameraButton } from "~/components/composite/camera-button";
import { DashboardPage } from "~/components/dashboard-page";
import { Badge } from "~/components/ui/badge";
import { api } from "~/hooks/api";
import { Table } from "./data-table";
import { Numpad } from "../../components/ui/numpad";
import { Logo } from "~/components/common/logo";
import { useUsbDevices } from "~/hooks/use-usb-devices";

const UiKitPage = () => {
  const suppliers = api.suppliers.useGetAll({ limit: 1000 });
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [detectedBarcode, setDetectedBarcode] = useState<string>("");
  const [numpadValue, setNumpadValue] = useState<string>("");
  const usbDevices = useUsbDevices();
  return (
    <DashboardPage title="UI Kit playground">
      <AsyncSelect
        value={selectedValue}
        onValueChange={setSelectedValue}
        query={suppliers}
        transformOption={(data) =>
          data.pages
            .flatMap((page) => page.items)
            .map((p) => ({
              label: p.name,
              value: p.id,
              ...p,
            }))
        }
        renderOption={(item) => (
          <div className="flex gap-2 items-center">
            <div className="text-sm">{item.name}</div>
            <Badge variant="outline">{item.phone}</Badge>
          </div>
        )}
      />
      <pre>{JSON.stringify({ selectedValue }, null, 2)}</pre>

      <CameraButton
        title="Scan Barcode"
        buttonLabel="Scan Barcode"
        icon={IconBarcode}
        onBarcodeDetected={(barcodes) => {
          setDetectedBarcode(barcodes[0].rawValue);
        }}
        autoCloseOnBarcodeDetected
      />
      <pre>{JSON.stringify({ detectedBarcode }, null, 2)}</pre>

      <Table />

      <Numpad
        onNumberClick={(num) => setNumpadValue(numpadValue + num)}
        onBackspace={() => setNumpadValue(numpadValue.slice(0, -1))}
        onEnter={() => console.log(numpadValue)}
      />
      <pre>{JSON.stringify({ numpadValue }, null, 2)}</pre>

      <div className="flex gap-2">
        <h2>Logos</h2>
        <Logo variant="icon" />
        <Logo variant="full" />
        <Logo variant="text" />
      </div>

      <div className="mt-4">
        <pre>{JSON.stringify({ usbDevices: usbDevices.data, error: usbDevices.error }, null, 2)}</pre>
      </div>
    </DashboardPage>
  );
};

export default UiKitPage;
