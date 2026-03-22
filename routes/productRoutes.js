const express = require("express");
const { createProduct, getProducts, getProductById, deleteProduct } = require("../controllers/productControllers");
const router = express.Router();



// Routes
router.post("/", createProduct);        // Add product
router.get("/", getProducts);           // Get all products
router.get("/:id", getProductById);     // Get single product
router.delete("/:id", deleteProduct);   // Delete product

module.exports = router;