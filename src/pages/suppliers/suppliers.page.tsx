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
import { CreateSupplier } from "./use-create-supplier";
import type { Suppliers } from "./use-create-supplier";




export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const { suppliers, fetchSuppliers, toggleAnalytics, toggleBlocked } = useSuppliers();
  // const { mutateAsync: createSupplier } = useCreateSupplier();

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleCreateSupplier = async (data: { code: string; name: string; agent: string; phone: string; delayDays: number; taxID: string; blocked: boolean; analytics: boolean; comments: string }) => {
    try {
      await CreateSupplier(data)
      console.log("Поставщик создан")
      // await createSupplier(requestData);
      setOpen(false);
      await fetchSuppliers();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEditSupplier = (supplier: Suppliers) => {
    console.log('Редактировать поставщика:', supplier);
    // Здесь можно открыть модальное окно для редактирования
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
    </div>
  );
} 