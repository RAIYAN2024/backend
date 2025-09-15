import vendorController from "@/controllers/vendor.controller";
import { Router } from "express";
const router = Router();
router.post("/vendor/signup", vendorController.Signup);
router.post("/vendor/login", vendorController.Login);
router.get("/vendor/all", vendorController.GetVendors);

export default router;
