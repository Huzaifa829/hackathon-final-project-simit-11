import express from "express";
import {upload} from "../middleware/Multer.middleware.js";
import { getOrderById, getOrders, placeOrder } from "../controllers/Ordercontroller.js";

const router = express.Router();

router.post("/orders", placeOrder);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);



export default router;