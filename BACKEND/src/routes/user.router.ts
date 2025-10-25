import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", authenticate, authorizedRole(["admin"]), userController.getUsers);
router.get("/sem-age", authenticate, authorizedRole(["admin"]), userController.getUsersSemAge);
router.get("/:id", authenticate, authorizedRole(["admin"]),userController.getUserById);

export default router;