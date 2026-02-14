import express from "express";
import {
  addProduct,
  getProducts,
  deleteProduct
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();

// Public
router.get("/", getProducts);

// Admin
router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  addProduct
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin,
  deleteProduct
);

export default router;
