import User from "../models/User.js";
import Product from "../models/Product.js";


// Get all users
export const getAllUsers = async (req, res) => {

  const users = await User.find().select("-password");

  res.json({
    success: true,
    users
  });

};


// Block user
export const blockUser = async (req, res) => {

  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: true
  });

  res.json({
    success: true,
    message: "User blocked"
  });

};


// Delete user
export const deleteUser = async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "User deleted"
  });

};


// Dashboard stats
export const getDashboard = async (req, res) => {

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.json({
    success: true,
    totalUsers,
    totalProducts
  });

};
