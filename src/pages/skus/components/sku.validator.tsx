import { UnitMeasurementEnum } from "@salut-mercado/octo-client";
import { z } from "zod/v4";

export const skuSchema = z.object({
  id: z.string().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  name: z.string().min(1),
  supplier_id: z.string().min(1),
  producer_id: z.string().min(1),
  category_id: z.string().min(1),
  unit_measurement: z.enum(UnitMeasurementEnum),
  shelf_lifetime: z.number().min(0),
  net_weight: z.number().min(0),
  vat_percent: z.number().min(0).max(100).multipleOf(0.01),
  alcohol_percent: z.number().min(0).max(100),
  natural_loss_percent: z.number().min(0).max(100),
  max_on_checkout: z.number().min(0),
  specifications: z.string(),
  barcode: z.string(),
  wholesale_price: z.number().min(0).multipleOf(0.00001),
});
