import { z } from "zod/v4";

export const producerSchema = z.object({
  name: z.string().min(1),
  nif: z.string().min(1).length(9),
  minimum_stock: z.number().min(0),
});
