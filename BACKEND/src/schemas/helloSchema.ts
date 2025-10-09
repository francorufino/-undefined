import { z } from "zod";

export const helloSchema = z.object({
  name: z.string()
  .min(3, "Name is required and must be at least 3 characters long")
  .max(50, "Name must be at most 50 characters long"),
  age: z.number().positive().optional(),
});

export type HelloSchema = z.infer<typeof helloSchema>;