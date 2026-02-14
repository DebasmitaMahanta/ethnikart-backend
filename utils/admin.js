import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

connectDB();

const createAdmin = async () => {

  const exists = await User.findOne({
    email: "admin@ethnikart.com"
  });

  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const password = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@ethnikart.com",
    password,
    role: "admin"
  });

  console.log("Admin Created");
  process.exit();

};

createAdmin();
