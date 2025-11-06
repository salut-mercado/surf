import { z } from "zod/v4";

export const supplierSchema = z.object({
  id: z.string().min(1),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  code: z.string().min(1),
  name: z.string().min(1),
  agent: z.string().min(1),
  phone: z.string().min(1),
  delay_days: z.number().min(0),
  nif: z.string().min(1).length(9),
  blocked: z.boolean(),
  comments: z.string(),
});
