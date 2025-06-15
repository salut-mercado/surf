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
import type { SuppliersSchema } from "@salut-mercado/octo-client";

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const { suppliers, fetchSuppliers, createSupplier, toggleAnalytics, toggleBlocked } = useSuppliers();


  const [newSupplier, setNewSupplier] = useState<Partial<SuppliersSchema>>({
    agent: "",
    code: "",
    name: "",
    phone: "",
    delayDays: 1,
    analytics: true,
    blocked: false,
    comments: "",
    taxID: "",
  });

  useEffect(() => {
    console.log('Component mounted, fetching suppliers...');
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleCreateSupplier = async () => {
    try {
      await createSupplier(newSupplier);
      setOpen(false);
      setNewSupplier({
        agent: "",
        code: "",
        name: "",
        phone: "",
        delayDays: 1,
        analytics: true,
        blocked: false,
        comments: "",
        taxID: "",
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

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
                <CreateSupplierForm
                  newSupplier={newSupplier}
                  setNewSupplier={setNewSupplier}
                  onSubmit={handleCreateSupplier}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <SuppliersTable
            suppliers={suppliers}
            onToggleAnalytics={toggleAnalytics}
            onToggleBlocked={toggleBlocked}
          />
        </CardContent>
      </Card>
    </div>
  );
} 