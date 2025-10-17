import { z } from "zod";

export const userSchema = z.object({
  name: z.string()
  .min(3, "Name is required and must be at least 3 characters long")
  .max(50, "Name must be at most 50 characters long"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["user", "admin"]),
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

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password is required")
});

export type userSchema = z.infer<typeof userSchema>;
export type loginSchema = z.infer<typeof loginSchema>;