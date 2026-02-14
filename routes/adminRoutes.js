import express from "express";
import {
  getAllUsers,
  blockUser,
  deleteUser,
  getDashboard
} from "../controllers/adminController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, getAllUsers);

router.put("/block-user/:id", isAuthenticated, isAdmin, blockUser);

router.delete("/delete-user/:id", isAuthenticated, isAdmin, deleteUser);

router.get("/dashboard", isAuthenticated, isAdmin, getDashboard);

export default router;
