import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {Plus} from "lucide-react";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type {
    FirmsProducerSchema
} from "~/lib/.generated/client";
import {useProducers} from "~/pages/producers/use-producers.ts";
import {ProducersTable} from "~/pages/producers/producers-table.tsx";
import { useCreateProducer } from "~/pages/producers/use-create-producer.ts";

export default function ProducersPage() {
    const [open, setOpen] = useState(false);
    const {data: producers = [], refetch} = useProducers({});
    const createMutation = useCreateProducer();

    const [newProducer, setNewProducer] = useState<FirmsProducerSchema>({
        name: "",
        taxID: "",
        minimumStock: 0,
    });

    const handleCreateProducer = async () => {
        try {
            const requestData = {
                firmsProducerSchema: newProducer
            };

            await createMutation.mutateAsync(requestData);

            refetch();
            setOpen(false);
            setNewProducer({
                name: "",
                taxID: "",
                minimumStock: 0,
            });
        } catch (err) {
            console.error("Error creating producer:", err);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Producers</CardTitle>
                            <CardDescription>Manage producer data and inventory requirements</CardDescription>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Producer
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Producer</DialogTitle>
                                    <DialogDescription>
                                        Fill in the producer information.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Producer name"
                                            value={newProducer.name}
                                            onChange={(e) => setNewProducer({...newProducer, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="taxID">Tax ID</Label>
                                        <Input
                                            id="taxID"
                                            placeholder="Tax identification number"
                                            value={newProducer.taxID}
                                            onChange={(e) => setNewProducer({...newProducer, taxID: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minimumStock">Minimum Stock</Label>
                                        <Input
                                            id="minimumStock"
                                            type="number"
                                            min={0}
                                            value={newProducer.minimumStock}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value >= 0) {
                                                    setNewProducer({
                                                        ...newProducer,
                                                        minimumStock: value,
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleCreateProducer}
                                        disabled={createMutation.isPending}
                                    >
                                        {createMutation.isPending ? "Creating..." : "Create Producer"}
                                    </Button>

                                    {createMutation.isError && (
                                        <div className="text-red-500 text-sm">
                                            Error: {createMutation.error.message}
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <ProducersTable producers={producers}/>
                </CardContent>
            </Card>
        </div>
    );
}