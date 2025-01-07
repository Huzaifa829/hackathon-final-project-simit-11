import express from 'express';
import { productModle } from '../Models/Product.model.js';
import { Usermodle } from '../Models/User.model.js';
import mongoose from 'mongoose';
import { uploadImageToCloudinary } from '../config/cloudinary.config.js';

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

    const imagepth = req.file ? req.file.path : req.body.image;
    if (!imagepth) {
      return res.status(400).json({ message: 'Image is required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    const url = await uploadImageToCloudinary(imagepth);
    if (!url) {
      return res.status(400).json({ message: 'url is required.' });
    }
    const image = url;

    const newProduct = await productModle.create({
      name,
      description,
      price,
      image,
      createdBy: userId,
    });
    console.log('User ID:', userId);
    // await newProduct.save();

    const user = await Usermodle.findById(userId);

    if (!user) {
      return res.status(401).json({ messege: 'user not exit' });
    }
    console.log(user);
    await user.updateOne({
      $push: {
        products: newProduct._id,
      },
    });
    // user.products.push(newProduct._id);
    // await user.save();

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

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    if (pageNumber <= 0 || limitNumber <= 0) {
      return res.status(400).json({
        message: 'no product founded.',
      });
    }

    const totalProducts = await productModle.countDocuments();
    const totalPages = Math.ceil(totalProducts / limitNumber);
    const products = await productModle
      .find()
      .skip((pageNumber - 1) * limitNumber) // Skip products for previous pages
      .limit(limitNumber) // Limit the number of products for the current page
      .sort({ createdAt: -1 }); // Sort by newest first (optional)

    res.status(200).json({
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      productsPerPage: limitNumber,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // Fetch the product by ID
    const product = await productModle.findById(id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Return the product details
    res.status(200).json({
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        user: product.user,
        orderItems: product.orderItems,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, userId } = req.body;

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.1' });
    }

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.2' });
    }

    // Check if the product exists
    const product = await productModle.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if the user is the owner of the product
    if (product.createdBy.toString() !== userId) {
      console.log('====================================');
      console.log(product.createdBy.toString());
      console.log(typeof(userId));
      console.log('====================================');
      return res.status(403).json({ message: 'You are not authorized to update this product.' });
    }

    // Update the product fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) {
      if (price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive value.' });
      }
      product.price = price;
    }
    if (image) product.image = image;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: 'Product updated successfully.',
      product: {
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        user: product.user,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    // Find the product
    const product = await productModle.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check if the user is the owner of the product
    if (product.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this product.' });
    }

    // Delete the product
    await product.deleteOne();

    // Remove the product from the user's list of products
    const user = await Usermodle.findById(userId);
    if (user) {
      await user.updateOne({
        $pull: { products: id },
      });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};