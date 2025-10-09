import { z } from "zod";

export const userSchema = z.object({
  name: z.string()
  .min(3, "Name is required and must be at least 3 characters long")
  .max(50, "Name must be at most 50 characters long"),
  email: z.email("Invalid email format"),
  age: z.preprocess(
    (val)=> {
      if (val === "" || val === null || val === undefined) return null;
      const n = Number(val);
      return isNaN(n) ? NaN : n;
  },
  z.union([
    z.number().min(18, "Must be 18+"),
    z.null().refine(()=> false, {message: "Age is required"})
    ])
  )
});

export type userSchema = z.infer<typeof userSchema>;