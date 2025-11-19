import { z } from "zod/v4";

export const createInflowSchema = z.object({
  supplier_id: z.string().min(1, "Supplier is required"),
  items: z
    .array(
      z.object({
        sku_id: z.string().min(1, "SKU is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        warehouse_id: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
});

export type CreateInflowFormValues = z.infer<typeof createInflowSchema>;

