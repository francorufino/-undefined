import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", authenticate, productController.getProducts);
router.post("/", authenticate, authorizedRole(["admin"]), upload.fields([{name: "images", maxCount: 6}, {name: "videos", maxCount: 1}]), productController.createProduct);
router.get("/:id", authenticate, productController.getProductsById);
router.delete("/:id", authenticate, authorizedRole(["admin"]), productController.deleteProduct);

export default router;