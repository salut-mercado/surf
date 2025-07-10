import {useState} from "react";
import {Button} from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {Plus} from "lucide-react";
import {
    UnitMeasurementEnum,
    type SKUSchema,
} from "@salut-mercado/octo-client";
import type {CreateSkuApiSkuPostRequest} from "@salut-mercado/octo-client";
import {SkusTable} from "~/pages/sku/sku-table";
import {useCreateSku} from "~/pages/sku/use-create-sku.ts";
import {useSku} from "~/pages/sku/use-sku.ts";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";

import type {SupplierWithId} from "~/pages/suppliers/suppliers-table.tsx";
import type {ProducerWithId} from "~/pages/producers/producers-page.tsx";
import type {CategoryWithId} from "~/pages/category/category-page.tsx";
import {useSuppliers} from "~/pages/suppliers/use-suppliers";
import {useProducers} from "~/pages/producers/use-producers";
import {useCategories} from "~/pages/category/use-category";
import {Select, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {SelectContent} from "~/components/ui/select.tsx";

export type SkuWithId = SKUSchema & { id: string };

const unitMeasurementOptions = [
    {value: UnitMeasurementEnum.unit, label: "Unit"},
    {value: UnitMeasurementEnum.kg, label: "Kg"},
    {value: UnitMeasurementEnum.liter, label: "Liter"},
];

export default function SkusPage() {
    const [openCreate, setOpenCreate] = useState(false);
    const [openMoreDialog, setOpenMoreDialog] = useState(false);
    const [selectedSku, setSelectedSku] = useState<SkuWithId | null>(null);

    const {data: skus = [], refetch} = useSku({});
    const createMutation = useCreateSku();

    const {data: suppliersResponse} = useSuppliers({});
    const suppliers: SupplierWithId[] = suppliersResponse?.items || [];

    const {data: producers} = useProducers({});
    const {data: categories} = useCategories({});

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
    });

    const handleCreateSku = async () => {
        try {
            const requestData: CreateSkuApiSkuPostRequest = {
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
            });
        } catch (err) {
            console.error("Error creating SKU:", err);
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
                                    <Plus className="h-4 w-4 mr-2"/>
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
                                                setNewSku({...newSku, name: e.target.value})
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Supplier*</Label>
                                        <Select
                                            value={newSku.supplierId}
                                            onValueChange={(value) =>
                                                setNewSku({...newSku, supplierId: value})
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Supplier"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {suppliers && suppliers.map((s: SupplierWithId) => (
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
                                                setNewSku({...newSku, producerId: value})
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Producer"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {producers && producers.map((p: ProducerWithId) => (
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
                                                setNewSku({...newSku, categoryId: value})
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Category"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories && categories.map((c: CategoryWithId) => (
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
                                                <SelectValue placeholder="Select Unit"/>
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

                <CardContent>
                    <SkusTable skus={skus}
                               onMoreClick={(sku) => {
                                   setSelectedSku(sku as SkuWithId);
                                   setOpenMoreDialog(true);
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
                            <p><strong>Name:</strong> {selectedSku.name}</p>
                            <p><strong>Supplier:</strong> {selectedSku.supplierId}</p>
                            <p><strong>Producer:</strong> {selectedSku.producerId}</p>
                            <p><strong>Category:</strong> {selectedSku.categoryId}</p>
                            <p><strong>Unit:</strong> {selectedSku.unitMeasurement}</p>
                            <p><strong>Shelf Life:</strong> {selectedSku.shelfLifetime}</p>
                            <p><strong>Net Weight:</strong> {selectedSku.netWeight}</p>
                            <p><strong>VAT %:</strong> {selectedSku.vatPercent}</p>
                            <p><strong>Alcohol %:</strong> {selectedSku.alcoholPercent}</p>
                            <p><strong>Natural Loss %:</strong> {selectedSku.naturalLossPercent}</p>
                            <p><strong>Max on Checkout:</strong> {selectedSku.maxOnCheckout}</p>
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