import { Router } from "express";
import { loginSchema, userSchema } from "../schemas/userSchema";
import { validate } from "../middlewares/validate";
import {createUser, login} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(userSchema), createUser);
router.post("/login", validate(loginSchema), login);

export default router;