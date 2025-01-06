import express from 'express';
import { productModle } from '../Models/Product.model.js';
import { Usermodle } from '../Models/User.model.js';
import mongoose from 'mongoose';

export const Products = async (req, res) => {
  try {
    const { name, description, price, userId } = req.body;

    if (!name || !description || !price || !userId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (price <= 0) {
      return res
        .status(400)
        .json({ message: 'Price must be a positive value.' });
    }

    const image = req.file ? req.file.path : req.body.image;
    if (!image) {
      return res.status(400).json({ message: 'Image is required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    console.log('User ID:', userId);

    const newProduct = await productModle.create({
      name,
      description,
      price,
      image,
      user: userId,
    });
    await newProduct.save();

    const user = await Usermodle.findById(userId);

    if(!user){
      return res.status(401).json({messege:'user not exit'})
    }
    console.log(user);
    user.products.push(newProduct._id);
    await user.save();

    res.status(201).json({
      message: 'Product created successfully.',
      product: {
        id: newProduct._id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image: newProduct.image,
        user: newProduct.user,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for field: ${duplicateKey}`,
        field: duplicateKey,
        value: error.keyValue[duplicateKey],
      });
    } else {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};
