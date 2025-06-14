import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { SuppliersSchema } from "@salut-mercado/octo-client";

interface CreateSupplierFormProps {
  newSupplier: Partial<SuppliersSchema>;
  setNewSupplier: (supplier: Partial<SuppliersSchema>) => void;
  onSubmit: () => void;
}

export function CreateSupplierForm({ newSupplier, setNewSupplier, onSubmit }: CreateSupplierFormProps) {
  const handleChange = (field: keyof SuppliersSchema, value: string | number | boolean) => {
    setNewSupplier({ ...newSupplier, [field]: value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="supplierCode">Supplier Code</Label>
          <Input
            id="supplierCode"
            value={newSupplier.code}
            onChange={(e) => handleChange("code", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="supplierName">Supplier Name</Label>
          <Input
            id="supplierName"
            value={newSupplier.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="agent">Agent</Label>
          <Input
            id="agent"
            value={newSupplier.agent}
            onChange={(e) => handleChange("agent", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={newSupplier.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taxID">Tax ID</Label>
          <Input
            id="taxID"
            value={newSupplier.taxID}
            onChange={(e) => handleChange("taxID", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="delayDays">Delay Days</Label>
          <Input
            id="delayDays"
            type="number"
            min="1"
            value={newSupplier.delayDays}
            onChange={(e) => handleChange("delayDays", parseInt(e.target.value))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="comments">Comments</Label>
          <Input
            id="comments"
            value={newSupplier.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Create Supplier</Button>
    </form>
  );
} 