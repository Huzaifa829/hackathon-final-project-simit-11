import express from "express";
import dotenv from "dotenv";
import userroutes from "./src/routes/UserRoutes.js";
import ProductRoutes from "./src/routes/ProductRoutes.js";
import connectDb from "./src/db/index.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json());

app.use("/api/v1", userroutes);
app.use("/api/v1", ProductRoutes);

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
