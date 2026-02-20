import express from "express";

import { isAuthenticated } from "../middleware/authMiddleware.js";

import {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// ➕ CREATE PRODUCT (admin only)
router.post(
  "/",
  isAuthenticated,               // 🔐 check login
  upload.fields([
    { name: "productImages", maxCount: 10 },
    { name: "thumbnails", maxCount: 3 },
  ]),
  addProduct
);



// 📄 GET ALL PRODUCTS (public)
router.get("/", getProducts);


// 🔍 GET SINGLE PRODUCT (public)
router.get("/:id", getSingleProduct);


// ✏️ UPDATE PRODUCT (admin only)
router.put(
  "/:id",
  isAuthenticated,
  upload.fields([
    { name: "productImages", maxCount: 10 },
    { name: "thumbnails", maxCount: 3 },
  ]),
  updateProduct
);


// ❌ DELETE PRODUCT (admin only)
router.delete("/:id", isAuthenticated, deleteProduct);


// ⭐ ADD REVIEW (logged-in user)
router.post("/review", isAuthenticated, addReview);


export default router;