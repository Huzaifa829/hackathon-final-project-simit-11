import express from "express";
import { forgotPassword, Login, resetPassword, Signup, verifyOtp } from "../controllers/Usercontroller.js";
// import upload from "../middleware/Multer.middleware.js";

const router = express.Router();

router.post("/auth/register", Signup);
router.post("/auth/login", Login);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);

export default router;
