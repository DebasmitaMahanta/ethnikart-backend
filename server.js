import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { isAuthenticated } from "./middleware/authMiddleware.js";
import { isAdmin } from "./middleware/adminMiddleware.js";
import upload from "./middleware/uploadMiddleware.js";
import { addProduct } from "./controllers/productController.js";


dotenv.config();


connectDB();

// Create app
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res) => {
    res.send("Ethnikart Backend Running");
});

app.use("/api/products", productRoutes);

// Legacy/alternate product create endpoint (supports existing clients calling /api/addProduct)
app.post(
  "/api/addProduct",
  isAuthenticated,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnails", maxCount: 3 },
  ]),
  addProduct
);

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
