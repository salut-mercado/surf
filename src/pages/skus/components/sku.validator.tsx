import { UnitMeasurementEnum } from "@salut-mercado/octo-client";
import { z } from "zod/v4";

export const skuSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string().min(1),
  supplierId: z.string().min(1),
  producerId: z.string().min(1),
  categoryId: z.string().min(1),
  unitMeasurement: z.enum(UnitMeasurementEnum),
  shelfLifetime: z.number().min(0),
  netWeight: z.number().min(0),
  vatPercent: z.number().min(0).max(100).multipleOf(0.01),
  alcoholPercent: z.number().min(0).max(100),
  naturalLossPercent: z.number().min(0).max(100),
  maxOnCheckout: z.number().min(0),
  specifications: z.string(),
  barcode: z.string(),
  wholesalePrice: z.number().min(0),
});
