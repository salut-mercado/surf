import { z } from "zod/v4";

export const storeSchema = z.object({
  id: z.string().min(1),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  address: z.string().min(1),
  legal_entity: z.string().min(1),
  price: z.number().min(0),
  ip: z.string().min(1),
  sales_area: z.number().min(0),
  total_area: z.number().min(0),
  date_of_first_sale: z.string().min(1),
  working_hours: z.string().min(1),
  claster: z.string().min(1),
  contacts: z.string().min(1),
  assortment_matrix: z.string().min(1),
  service_provider: z.string().min(1),
});
