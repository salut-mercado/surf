import { useState } from "react";
import { AsyncSelect } from "~/components/composite/async-select";
import { DashboardPage } from "~/components/dashboard-page";
import { Badge } from "~/components/ui/badge";
import { api } from "~/hooks/api";

const UiKitPage = () => {
  const suppliers = api.suppliers.useGetAll({});
  const [selectedValue, setSelectedValue] = useState<string>("");
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
    </DashboardPage>
  );
};

export default UiKitPage;
