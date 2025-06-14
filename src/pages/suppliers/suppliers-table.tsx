import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Switch } from "~/components/ui/switch";
import type { SuppliersSchema } from "@salut-mercado/octo-client";

interface SuppliersTableProps {
  suppliers: SuppliersSchema[];
  onToggleAnalytics: (supplierCode: string, checked: boolean) => void;
  onToggleBlocked: (supplierCode: string, checked: boolean) => void;
}

export function SuppliersTable({ suppliers, onToggleAnalytics, onToggleBlocked }: SuppliersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Tax ID</TableHead>
            <TableHead>Delay Days</TableHead>
            <TableHead>Analytics</TableHead>
            <TableHead>Blocked</TableHead>
            <TableHead>Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier: SuppliersSchema) => (
            <TableRow key={supplier.code}>
              <TableCell>{supplier.code}</TableCell>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.agent}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.taxID}</TableCell>
              <TableCell>{supplier.delayDays}</TableCell>
              <TableCell>
                <Switch
                  checked={supplier.analytics}
                  onCheckedChange={(checked) => onToggleAnalytics(supplier.code, checked)}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={supplier.blocked}
                  onCheckedChange={(checked) => onToggleBlocked(supplier.code, checked)}
                />
              </TableCell>
              <TableCell>{supplier.comments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 