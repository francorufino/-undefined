import { Request, Response, Router } from "express";
import { helloSchema } from "../schemas/helloSchema.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

router.post("/", (req: Request, res: Response) => {
  const hello = helloSchema.safeParse(req.body);

  if (!hello.success) {
    return res.status(400).json({ 
      issues: hello.error.issues,
      error: hello.error.message
    });
  }
  if (hello.data.age) {
    return res.json({ message: `Hello ${hello.data.name}! You are ${hello.data.age} years old.` });
  }

  return res.json({ message: `Hello ${hello.data.name}!` });
})

export default router;