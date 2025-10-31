import { z } from "zod/v4";

export const storeSchema = z.object({
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  address: z.string().min(1),
  legalEntity: z.string().min(1),
  price: z.number().min(0),
  ip: z.string().min(1),
  salesArea: z.number().min(0),
  totalArea: z.number().min(0),
  dateOfFirstSale: z.string().min(1),
  workingHours: z.string().min(1),
  claster: z.string().min(1),
  contacts: z.string().min(1),
  assortmentMatrix: z.string().min(1),
  serviceProvider: z.string().min(1),
});
