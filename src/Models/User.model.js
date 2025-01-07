import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  token: { type: String, default: "" },
  otp: {
    value: { type: String },
    expireAt: { type: Date },
    verified: { type: Boolean, default: "false" },
  },
});


export const Usermodle = mongoose.model("User" , Userschema);