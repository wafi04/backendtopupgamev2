import { Router, Request, Response } from "express";
import { getHealth } from "@/middleware/health";
import authRoutes from "@/services/auth/controller/route";
import CategoriesRoute from "@/services/categories/controller/categories";
import { subCategoriesController } from "@/services/categories/controller/subCategories";
import { MethodsRoutes } from "../services/methods/controller";
import { ProductRoutes } from "@/services/layanan/controller";
import GetProductFromDigiflazz from "@/lib/digiflazz/get-product";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.send("Service Ready to Accept Connection !!!");
});

router.get("/api/v1/digiflazz/get-product", GetProductFromDigiflazz);
router.get("/health", getHealth);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/categories", CategoriesRoute);
router.use("/api/v1/subcategories", subCategoriesController);
router.use("/api/v1/methods", MethodsRoutes);
router.use("/api/v1/products", ProductRoutes);

export default router;
