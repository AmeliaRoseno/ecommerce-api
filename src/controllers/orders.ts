import type { Request, Response } from 'express';
import { Order, User, Product } from '../models/index.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find()
    .populate('userId', '-password')
    .populate('products.productId');
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('userId', '-password')
    .populate('products.productId');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { userId, products } = req.body;

  // 1. Validate the user exists (FR017)
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: 'Invalid userId: user does not exist' });
  }

  // 2. Validate every product exists, and calculate total server-side (FR017 + FR018)
  let total = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return res.status(400).json({
        message: `Invalid productId: product ${item.productId} does not exist`,
      });
    }

    total += product.price * item.quantity;
  }

  // 3. Only now, after everything's validated, create the order
  const newOrder = await Order.create({ userId, products, total });
  res.status(201).json(newOrder);
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { userId, products } = req.body;

  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId: user does not exist' });
    }
  }

  let total;

  if (products) {
    total = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          message: `Invalid productId: product ${item.productId} does not exist`,
        });
      }

      total += product.price * item.quantity;
    }
  }

  const updateData = { ...req.body, ...(total !== undefined && { total }) };

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!updatedOrder) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(updatedOrder);
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (!deletedOrder) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(204).send();
});