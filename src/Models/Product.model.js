import mongoose from "mongoose";



const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, 
    },
    image: {
      type: String,
      required: true, 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", 
      },
    ],
  },
  {
    timestamps: true, 
  }
);

export const productModle = mongoose.model("Product" , ProductSchema);

