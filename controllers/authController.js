import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Register User
export const register = async (req, res) => {

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res.status(400).json({
      success: false,
      message: "User already exists"
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.json({
    success: true,
    message: "Registered Successfully"
  });

};


// Login
export const login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return res.status(400).json({
      success: false,
      message: "User not found"
    });

  if (user.isBlocked)
    return res.status(403).json({
      success: false,
      message: "User is blocked"
    });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(400).json({
      success: false,
      message: "Invalid Password"
    });

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 86400000,
    secure: true,
  sameSite: "none",
  });

  res.json({
    success: true,
    message: "Login Successful"
  });

};


// Logout
export const logout = (req, res) => {

  res.cookie("token", "", {
    expires: new Date(0)
  });

  res.json({
    success: true,
    message: "Logout Successful"
  });

};
