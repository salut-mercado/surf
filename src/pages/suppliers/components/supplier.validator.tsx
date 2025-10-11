import { z } from "zod/v4";

export const supplierSchema = z.object({
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  code: z.string().min(1),
  name: z.string().min(1),
  agent: z.string().min(1),
  phone: z.string().min(1),
  delayDays: z.number().min(0),
  nif: z.string().min(1),
  blocked: z.boolean(),
  comments: z.string().min(1),
});
