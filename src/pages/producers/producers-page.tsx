import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {Plus} from "lucide-react";
import {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";

import type {FirmsProducerSchema} from "~/lib/.generated/client";
import {useProducers} from "~/pages/producers/use-producers.ts";
import {ProducersTable} from "~/pages/producers/producers-table.tsx";


export default function ProducersPage() {
    const [open, setOpen] = useState(false);
    const {data: producers = [], refetch} = useProducers({});

    const [newProducer, setNewProducer] = useState<Partial<FirmsProducerSchema>>({
        name: "",
        taxID: "",
        minimumStock: 0,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleCreateProducer = async () => {
        try {
            setOpen(false);
            setNewProducer({
                name: "",
                taxID: "",
                minimumStock: 0,
            });
        } catch (err) {
            console.error("Error:", err);
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
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={newProducer.name}
                                        onChange={(e) => setNewProducer({...newProducer, name: e.target.value})}
                                        className="w-full border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tax ID"
                                        value={newProducer.taxID}
                                        onChange={(e) => setNewProducer({...newProducer, taxID: e.target.value})}
                                        className="w-full border p-2 rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Minimum Stock"
                                        value={newProducer.minimumStock}
                                        onChange={(e) => setNewProducer({
                                            ...newProducer,
                                            minimumStock: Number(e.target.value)
                                        })}
                                        className="w-full border p-2 rounded"
                                    />
                                    <Button onClick={handleCreateProducer}>Create</Button>
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
