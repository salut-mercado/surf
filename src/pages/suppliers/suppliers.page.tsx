import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CreateSupplierForm } from "~/pages/suppliers/create-supplier-form";
import { SuppliersTable } from "~/pages/suppliers/suppliers-table";
import { useSuppliers } from "~/pages/suppliers/use-suppliers";
// import { useCreateSupplier } from "~/pages/suppliers/use-create-supplier";
// import type { SuppliersSchema, CreateSppliersApiSuppliersPostRequest } from "@salut-mercado/octo-client";
import { CreateSupplier, PutSupplier } from "./use-create-supplier";
import type { Suppliers, UpdateSuppliers } from "./use-create-supplier";
// import type { SuppliersSchema } from "@salut-mercado/octo-client";
import type { SuppliersTableData } from "./suppliers-table";





export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const { suppliers, fetchSuppliers, toggleAnalytics, toggleBlocked } = useSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState<SuppliersTableData | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  // const { mutateAsync: createSupplier } = useCreateSupplier();

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleCreateSupplier = async (data: Suppliers | UpdateSuppliers) => {
    try {
      await CreateSupplier(data as Suppliers)
      console.log("Поставщик создан")
      // await createSupplier(requestData);
      setOpen(false);
      await fetchSuppliers();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEditSupplier = (supplier: SuppliersTableData) => {
    setSelectedSupplier(supplier);
    setEditOpen(true);
  };

  const handleUpdateSupplier = async (data: UpdateSuppliers) => {
    if (!selectedSupplier) return;
    try {
      await PutSupplier(data, selectedSupplier.id);
      setEditOpen(false);
      setSelectedSupplier(null);
      await fetchSuppliers();
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  };

  // const handleDeleteSupplier = async (code: string) => {
  //   if (confirm('Вы уверены, что хотите удалить этого поставщика?')) {
  //     console.log('Удалить поставщика с кодом:', code);
  //     // Здесь можно добавить API вызов для удаления
  //     // await deleteSupplier(code);
  //     // await fetchSuppliers();
  //   }
  // };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>Managing supplier data and settings</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>
                    Fill in the supplier information. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <CreateSupplierForm onSubmit={handleCreateSupplier} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <SuppliersTable
            suppliers={suppliers}
            onToggleAnalytics={toggleAnalytics}
            onToggleBlocked={toggleBlocked}
            onEdit={handleEditSupplier}
            // onDelete={handleDeleteSupplier}
          />
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              Update the supplier information.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplier && (
            <CreateSupplierForm 
              onSubmit={handleUpdateSupplier}
              initialValues={selectedSupplier}
              submitLabel="Update Supplier"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 