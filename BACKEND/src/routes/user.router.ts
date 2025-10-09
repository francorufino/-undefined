import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { userSchema } from "../schemas/userSchema.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", userController.getUsers);
router.get("/sem-age", userController.getUsersSemAge);
router.post("/", validate(userSchema), userController.createUser);
router.get("/:id", userController.getUserById);

export default router;