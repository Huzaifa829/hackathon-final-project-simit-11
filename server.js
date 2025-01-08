import express from "express";
import dotenv from "dotenv";
import userroutes from "./src/routes/UserRoutes.js";
import ProductRoutes from "./src/routes/ProductRoutes.js";
import ModelRoutes from "./src/routes/OrderRoutes.js";
import connectDb from "./src/db/index.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000
app.use(cors());

app.use(express.json());

app.use("/api/v1", userroutes);
app.use("/api/v1", ProductRoutes);
app.use("/api/v1", ModelRoutes);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
