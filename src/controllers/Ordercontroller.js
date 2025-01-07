import express from 'express';
import { productModle } from '../Models/Product.model.js';
import { Usermodle } from '../Models/User.model.js';
import { OrderModle } from '../Models/Order.model.js';
import mongoose from 'mongoose';

// import { OrderModel } from '../Models/Order.model.js';

export const placeOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Validate input
    if (!userId || !products || products.length === 0) {
      return res
        .status(400)
        .json({ message: 'User ID and products are required.' });
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    // Validate product IDs
    const validProducts = products.filter((id) =>
      mongoose.Types.ObjectId.isValid(id),
    );
    if (validProducts.length !== products.length) {
      return res.status(400).json({ message: 'Some product IDs are invalid.' });
    }

    // Fetch product details
    const productDetails = await productModle.find({
      _id: { $in: validProducts },
    });
    if (productDetails.length !== products.length) {
      return res.status(404).json({ message: 'Some products were not found.' });
    }

    // Calculate total price
    const totalPrice = productDetails.reduce(
      (sum, product) => sum + product.price,
      0,
    );

    // Ensure the user exists
    const user = await Usermodle.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create the order
    const newOrder = await OrderModle.create({
      user: userId,
      products: validProducts,
      totalPrice,
    });

    // Add the order to the user's orders (if a field for orders exists)
    // await user.updateOne({ $push: { orders: newOrder._id } });

    res.status(201).json({
      message: 'Order placed successfully.',
      order: {
        id: newOrder._id,
        user: newOrder.user,
        products: newOrder.products,
        totalPrice: newOrder.totalPrice,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID.' });
    }

    // Fetch orders for the authenticated user
    const orders = await OrderModle.find({ user: userId })
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({
      message: 'Orders retrieved successfully.',
      orders: orders.map((order) => ({
        id: order._id,
        user: {
          id: order.user._id,
          name: order.user.name,
          email: order.user.email,
        },
        products: order.products.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        })),
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format.' });
    }

    // Find the order by ID
    const order = await OrderModle.findById(id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({
      message: 'Order retrieved successfully.',
      order: {
        id: order._id,
        user: {
          id: order.user._id,
          name: order.user.name,
          email: order.user.email,
        },
        products: order.products.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        })),
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};