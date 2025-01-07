import express from "express";
import { deleteProductById, getProductById, getProducts, Products, updateProductById } from "../controllers/Productcontroller.js";
import {upload} from "../middleware/Multer.middleware.js";

const router = express.Router();

router.post("/products", upload.single("image"), Products);
router.get("/products", getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProductById);
router.delete('/products/:id', deleteProductById);


export default router;