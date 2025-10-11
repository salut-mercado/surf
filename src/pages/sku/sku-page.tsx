import type { AddSkuHandlerApiSkusPostRequest } from "@salut-mercado/octo-client";
import {
  UnitMeasurementEnum,
  type SKUSchema,
  type UpdateSkuHandlerApiSkusIdPutRequest,
  type SupplierReturnSchema,
} from "@salut-mercado/octo-client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SkusTable } from "~/pages/sku/sku-table";
import { useCreateSku } from "~/pages/sku/use-create-sku.ts";
import { useSku } from "~/pages/sku/use-sku.ts";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SelectContent } from "~/components/ui/select.tsx";
import type { FirmsProducerSchema } from "@salut-mercado/octo-client";
import { api } from "~/hooks/api";
import { useUpdateSku } from "~/pages/sku/use-update-sku.ts";

export type SkuWithId = SKUSchema & { id: string };

const unitMeasurementOptions = [
  { value: UnitMeasurementEnum.unit, label: "Unit" },
  { value: UnitMeasurementEnum.kg, label: "Kg" },
  { value: UnitMeasurementEnum.liter, label: "Liter" },
];

export default function SkusPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openMoreDialog, setOpenMoreDialog] = useState(false);
  const [selectedSku, setSelectedSku] = useState<SkuWithId | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const producersResp = api.producers.useGetAll({});
  const producersList: (FirmsProducerSchema & { id: string })[] =
    producersResp.data || [];

  const suppliersResp = api.suppliers.useGetAll({});
  const suppliers: SupplierReturnSchema[] =
    suppliersResp.data?.pages?.flatMap((p) => p.items) ?? [];

  const getSupplierName = (id: string) =>
    suppliers.find((s) => s.id === id)?.name || id;

  const getProducerName = (id: string) =>
    producersList?.find((p) => p.id === id)?.name || id;

  const getCategoryName = (id: string) =>
    categories?.find((c) => c.id === id)?.categoryName || id;

  const { data, refetch } = useSku({});
  const skus: SkuWithId[] = data?.items ?? [];
  const createMutation = useCreateSku();
  const updateMutation = useUpdateSku();

  const categoriesResp = api.categories.useGetAll({});
  const categories = categoriesResp.data;

  const [newSku, setNewSku] = useState<SKUSchema>({
    name: "",
    supplierId: "",
    producerId: "",
    categoryId: "",
    unitMeasurement: UnitMeasurementEnum.unit,
    shelfLifetime: 0,
    netWeight: 0,
    vatPercent: 0,
    alcoholPercent: 0,
    naturalLossPercent: 0,
    maxOnCheckout: 0,
    specifications: "",
    barcode: "",
    wholesalePrice: 0,
  });

  const handleCreateSku = async () => {
    try {
      const requestData: AddSkuHandlerApiSkusPostRequest = {
        sKUSchema: newSku,
      };

      await createMutation.mutateAsync(requestData);
      refetch();
      setOpenCreate(false);
      setNewSku({
        name: "",
        supplierId: "",
        producerId: "",
        categoryId: "",
        unitMeasurement: UnitMeasurementEnum.unit,
        shelfLifetime: 0,
        netWeight: 0,
        vatPercent: 0,
        alcoholPercent: 0,
        naturalLossPercent: 0,
        maxOnCheckout: 0,
        specifications: "",
        barcode: "",
        wholesalePrice: 0,
      });
    } catch (err) {
      console.error("Error creating SKU:", err);
    }
  };

  const handleEditSku = async () => {
    if (!selectedSku) return;

    try {
      const requestData: UpdateSkuHandlerApiSkusIdPutRequest = {
        id: selectedSku.id,
        sKUUpdateSchema: {
          name: selectedSku.name,
          supplierId: selectedSku.supplierId,
          producerId: selectedSku.producerId,
          categoryId: selectedSku.categoryId,
          unitMeasurement: selectedSku.unitMeasurement,
          shelfLifetime: selectedSku.shelfLifetime,
          netWeight: selectedSku.netWeight,
          vatPercent: selectedSku.vatPercent,
          alcoholPercent: selectedSku.alcoholPercent,
          naturalLossPercent: selectedSku.naturalLossPercent,
          maxOnCheckout: selectedSku.maxOnCheckout,
          specifications: selectedSku.specifications,
        },
      };

      console.log(requestData);
      await updateMutation.mutateAsync(requestData);
      refetch();
      setOpenEdit(false);
      setSelectedSku(null);
    } catch (err) {
      console.error("Error updating producer:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SKUs</CardTitle>
              <CardDescription>Manage stock keeping units</CardDescription>
            </div>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add SKU
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New SKU</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Name*</Label>
                    <Input
                      value={newSku.name}
                      onChange={(e) =>
                        setNewSku({ ...newSku, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Supplier*</Label>
                    <Select
                      value={newSku.supplierId}
                      onValueChange={(value) =>
                        setNewSku({ ...newSku, supplierId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers &&
                          suppliers.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Producer*</Label>
                    <Select
                      value={newSku.producerId}
                      onValueChange={(value) =>
                        setNewSku({ ...newSku, producerId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Producer" />
                      </SelectTrigger>
                      <SelectContent>
                        {producersList &&
                          producersList.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Category*</Label>
                    <Select
                      value={newSku.categoryId}
                      onValueChange={(value) =>
                        setNewSku({ ...newSku, categoryId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories &&
                          categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.categoryName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Unit*</Label>
                    <Select
                      value={newSku.unitMeasurement}
                      onValueChange={(value) =>
                        setNewSku({
                          ...newSku,
                          unitMeasurement: value as UnitMeasurementEnum,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitMeasurementOptions.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Shelf Lifetime (days)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newSku.shelfLifetime}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          shelfLifetime: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Net Weight</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={newSku.netWeight}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          netWeight: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>VAT (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={newSku.vatPercent}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          vatPercent: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alcohol (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={newSku.alcoholPercent}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          alcoholPercent: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Natural Loss (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={newSku.naturalLossPercent}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          naturalLossPercent: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max on Checkout</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newSku.maxOnCheckout}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          maxOnCheckout: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Specifications</Label>
                    <textarea
                      value={newSku.specifications}
                      onChange={(e) =>
                        setNewSku({
                          ...newSku,
                          specifications: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleCreateSku}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create SKU"}
                  </Button>
                </div>

                {createMutation.isError && (
                  <div className="text-red-500 text-sm mt-2">
                    Error: {createMutation.error?.message}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit SKU</DialogTitle>
            </DialogHeader>
            {selectedSku && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name*</Label>
                  <Input
                    value={selectedSku.name}
                    onChange={(e) =>
                      setSelectedSku({ ...selectedSku, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supplier*</Label>
                  <Select
                    value={selectedSku.supplierId}
                    onValueChange={(value) =>
                      setSelectedSku({ ...selectedSku, supplierId: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Producer*</Label>
                  <Select
                    value={selectedSku.producerId}
                    onValueChange={(value) =>
                      setSelectedSku({ ...selectedSku, producerId: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Producer" />
                    </SelectTrigger>
                    <SelectContent>
                      {producersList?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category*</Label>
                  <Select
                    value={selectedSku.categoryId}
                    onValueChange={(value) =>
                      setSelectedSku({ ...selectedSku, categoryId: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Unit*</Label>
                  <Select
                    value={selectedSku.unitMeasurement}
                    onValueChange={(value) =>
                      setSelectedSku({
                        ...selectedSku,
                        unitMeasurement: value as UnitMeasurementEnum,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitMeasurementOptions.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Shelf Lifetime (days)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={selectedSku.shelfLifetime}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        shelfLifetime: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Net Weight</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={selectedSku.netWeight}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        netWeight: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>VAT (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={selectedSku.vatPercent}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        vatPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alcohol (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={selectedSku.alcoholPercent}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        alcoholPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Natural Loss (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    value={selectedSku.naturalLossPercent}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        naturalLossPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max on Checkout</Label>
                  <Input
                    type="number"
                    min={0}
                    value={selectedSku.maxOnCheckout}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        maxOnCheckout: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Specifications</Label>
                  <textarea
                    value={selectedSku.specifications}
                    onChange={(e) =>
                      setSelectedSku({
                        ...selectedSku,
                        specifications: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleEditSku}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {updateMutation.isError && (
              <div className="text-red-500 text-sm mt-2">
                Error: {updateMutation.error?.message}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <CardContent>
          <SkusTable
            skus={skus}
            onMoreClick={(sku) => {
              setSelectedSku(sku as SkuWithId);
              setOpenMoreDialog(true);
            }}
            onRowClick={(sku) => {
              setSelectedSku(sku as SkuWithId);
              setOpenEdit(true);
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={openMoreDialog} onOpenChange={setOpenMoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details of SKU</DialogTitle>
          </DialogHeader>

          {selectedSku && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {selectedSku.name}
              </p>
              <p>
                <strong>Supplier:</strong>{" "}
                {getSupplierName(selectedSku.supplierId)}
              </p>
              <p>
                <strong>Producer:</strong>{" "}
                {getProducerName(selectedSku.producerId)}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {getCategoryName(selectedSku.categoryId)}
              </p>
              <p>
                <strong>Unit:</strong> {selectedSku.unitMeasurement}
              </p>
              <p>
                <strong>Shelf Life:</strong> {selectedSku.shelfLifetime}
              </p>
              <p>
                <strong>Net Weight:</strong> {selectedSku.netWeight}
              </p>
              <p>
                <strong>VAT %:</strong> {selectedSku.vatPercent}
              </p>
              <p>
                <strong>Alcohol %:</strong> {selectedSku.alcoholPercent}
              </p>
              <p>
                <strong>Natural Loss %:</strong>{" "}
                {selectedSku.naturalLossPercent}
              </p>
              <p>
                <strong>Max on Checkout:</strong> {selectedSku.maxOnCheckout}
              </p>
              <p className="break-words whitespace-pre-line max-w-full overflow-hidden">
                <strong>Specifications:</strong>{" "}
                <span className="break-all">{selectedSku.specifications}</span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
