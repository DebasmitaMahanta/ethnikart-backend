import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login First"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// import jwt from "jsonwebtoken";
// import User from "../models/User.js";


// // 🔐 Check Login
// export const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;

//     // ❌ no token
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Login first",
//       });
//     }

//     // ❌ invalid token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid or expired token",
//       });
//     }

//     // ❌ user not found
//     const user = await User.findById(decoded._id);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // optional: block user check
//     if (user.isBlocked) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is blocked",
//       });
//     }

//     req.user = user;

//     next();

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };