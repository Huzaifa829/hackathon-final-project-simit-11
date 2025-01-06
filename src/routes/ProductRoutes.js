import express from "express";
import { Products } from "../controllers/Productcontroller.js";
import upload from "../middleware/Multer.middleware.js";

const router = express.Router();

router.post("/products", upload.single("image"), Products);


export default router;