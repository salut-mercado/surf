import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type {
  FirmsProducerSchema,
  UpdateFirmProducerHandlerApiFirmsProducerIdPutRequest,
} from "@salut-mercado/octo-client";
import { useProducers } from "~/pages/producers/use-producers.ts";
import { ProducersTable } from "~/pages/producers/producers-table.tsx";
import { useCreateProducer } from "~/pages/producers/use-create-producer.ts";
import { useUpdateProducer } from "~/pages/producers/use-update-producers.ts";

export type ProducerWithId = FirmsProducerSchema & { id: string };

export default function ProducersPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { data: producers = [], refetch } = useProducers({});
  const createMutation = useCreateProducer();
  const updateMutation = useUpdateProducer();

  const [newProducer, setNewProducer] = useState({
    name: "",
    taxID: "",
    minimumStock: 0,
  });

  const [selectedProducer, setSelectedProducer] =
    useState<ProducerWithId | null>(null);

  const handleCreateProducer = async () => {
    try {
      const requestData = { firmsProducerSchema: newProducer };

      await createMutation.mutateAsync(requestData);
      refetch();
      setOpenCreate(false);
      setNewProducer({ name: "", taxID: "", minimumStock: 0 });
    } catch (err) {
      console.error("Error creating producer:", err);
    }
  };

  const handleEditProducer = async () => {
    if (!selectedProducer) return;

    try {
      const requestData: UpdateFirmProducerHandlerApiFirmsProducerIdPutRequest =
        {
          id: selectedProducer.id,
          firmsProducerUpdateSchema: {
            name: selectedProducer.name,
            taxID: selectedProducer.taxID,
            minimumStock: selectedProducer.minimumStock,
          },
        };

      console.log(requestData);
      await updateMutation.mutateAsync(requestData);
      refetch();
      setOpenEdit(false);
      setSelectedProducer(null);
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
              <CardTitle>Producers</CardTitle>
              <CardDescription>
                Manage producer data and inventory requirements
              </CardDescription>
            </div>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Producer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Producer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={newProducer.name}
                      onChange={(e) =>
                        setNewProducer({ ...newProducer, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID</Label>
                    <Input
                      value={newProducer.taxID}
                      onChange={(e) => {
                        if (createMutation.isError) createMutation.reset();
                        setNewProducer({
                          ...newProducer,
                          taxID: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Stock</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newProducer.minimumStock}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0)
                          setNewProducer({ ...newProducer, minimumStock: val });
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleCreateProducer}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create"}
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
          <ProducersTable
            producers={producers}
            onRowClick={(producer) => {
              setSelectedProducer(producer as ProducerWithId);
              setOpenEdit(true);
            }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openEdit}
        onOpenChange={(open) => {
          if (!open) setSelectedProducer(null);
          setOpenEdit(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Producer</DialogTitle>
          </DialogHeader>
          {selectedProducer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={selectedProducer.name}
                  onChange={(e) =>
                    setSelectedProducer({
                      ...selectedProducer,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <Input
                  value={selectedProducer.taxID}
                  onChange={(e) => {
                    if (updateMutation.isError) updateMutation.reset();
                    setSelectedProducer({
                      ...selectedProducer,
                      taxID: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={selectedProducer.minimumStock}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) {
                      setSelectedProducer({
                        ...selectedProducer,
                        minimumStock: val,
                      });
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleEditProducer}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>

              {updateMutation.isError && (
                <div className="text-red-500 text-sm">
                  Error: {updateMutation.error.message}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
