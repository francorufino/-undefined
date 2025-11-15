import { z } from "zod";

export const productSchema = z.object({
  name: z.string()
    .min(3, "Product name is required and must be at least 3 characters long")
    .max(100, "Product name must be at most 100 characters long"),
  description: z.string()
    .min(10, "Description is required and must be at least 10 characters long")
    .max(1000, "Description must be at most 1000 characters long"),
  price: z.number()
    .min(0.01, "Price must be at least 0.01")
    .max(10000, "Price must be at most 10000"),
  modelRobot: 
  z.preprocess((arg) => {
    if (typeof arg === "string") {
      return [arg.toUpperCase()];
    }
    if (Array.isArray(arg)) {
      return arg.map((model) => {
        String(model).toUpperCase();
      })
    }
        return arg;
  }, z.array(z.enum(["HUMANOID", "PET", "VACUUM"], "Each ModelRobot must be one of: HUMANOID, PET, VACUUM"))),
     onSale: z.boolean(),
   stock: z.number().min(1, "Stock must be at least 1"),
  imagemUrl: z.string()
    .url("Image URL must be a valid URL")
    .optional(),
  videoUrl: z.string()
  .url("Video URL must be a valid URL")
    .optional(),
});