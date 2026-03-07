import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import {
  addProduct,
  getProducts,
  getSingleProduct,
  getCategories,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  addReview
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
const optionalUpload = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  if (contentType.startsWith("multipart/form-data")) {
    return upload.fields([
      { name: "images", maxCount: 10 },
      { name: "thumbnails", maxCount: 3 },
    ])(req, res, next);
  }

  next();
};


router.post(
  "/",
  isAuthenticated, 
  isAdmin,
  optionalUpload,
  addProduct
);



// 🏷️ GET CATEGORIES (public)
router.get("/categories", getCategories);
router.get("/category/:category", getProductsByCategory);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);


// ✏️ UPDATE PRODUCT (admin only)
router.put(
  "/:id",
  isAuthenticated,
  isAdmin,
  optionalUpload,
  updateProduct
);



router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);



router.post("/review", isAuthenticated, addReview);


export default router;