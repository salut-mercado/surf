import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
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
import { CreateSupplier, /*PutSupplier*/ } from "./use-create-supplier";
import type { SupplierSchema, SupplierUpdateSchema } from "@salut-mercado/octo-client";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateSupplier } from "./use-update-suppliers";
import type { tempSuppliersTableData } from "./suppliersData";



export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useSuppliers({});
  const [selectedSupplier, setSelectedSupplier] = useState<tempSuppliersTableData | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const createSupplierMutation = CreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const queryClient = useQueryClient();


  const handleCreateSupplier = async (formData: SupplierSchema) => {
    try {
      await createSupplierMutation.mutateAsync(
        { supplierSchema: formData },
        {
          onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
          },
          onError: (error) => {
            console.error("Ошибка при создании поставщика:", error);
          }
        }
      );
    } catch (err) {
      console.error("Ошибка при выполнении мутации:", err);
    }
  };

  const handleEditSupplier = (supplier: tempSuppliersTableData) => {
    setSelectedSupplier(supplier);
    setEditOpen(true);
  };

  const handleUpdateSupplier = async (formData: SupplierUpdateSchema) => {
    if (!selectedSupplier) return;
    
    try {
      await updateSupplierMutation.mutateAsync(
        {
          id: selectedSupplier.id,
          supplierUpdateSchema: formData,
        },
        {
          onSuccess: () => {
            setEditOpen(false);
            setSelectedSupplier(null);
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
          },
          onError: (error) => {
            console.error('Ошибка при обновлении поставщика:', error);
          }
        }
      );
    } catch (err) {
      console.error('Ошибка при выполнении мутации:', err);
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
                <CreateSupplierForm onSubmit={(data) => { void handleCreateSupplier(data); }} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Загрузка...</div>}
          {error && <div>Ошибка: {error.message}</div>}
          {!isLoading && !error && (
            <SuppliersTable
              suppliers={data?.items || []}
              onEdit={handleEditSupplier}
            />
          )}
        </CardContent>
      </Card>
      
      
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