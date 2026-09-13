import type { Request, Response } from 'express';
import { Product, Category } from '../models/index.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.query;
  const filter = categoryId ? { categoryId: String(categoryId) } : {};

  const products = await Product.find(filter).populate('categoryId');
  res.json(products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('categoryId');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.body.categoryId);

  if (!category) {
    return res.status(400).json({ message: 'Invalid categoryId: category does not exist' });
  }

  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.categoryId) {
    const category = await Category.findById(req.body.categoryId);

    if (!category) {
      return res.status(400).json({ message: 'Invalid categoryId: category does not exist' });
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(204).send();
});