import { Router } from "express";
import * as purchaseController from "../controllers/purchase.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, purchaseController.getPurchase);
// router.post("/", authenticate, purchaseController.createPurchase);
// router.get("/:id", authenticate,purchaseController.getPurchaseById);
// router.delete("/:id", authenticate,purchaseController.deletePurchase);

export default router;