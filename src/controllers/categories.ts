import type { Request, Response } from 'express';
import { Category } from '../models/index.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json(newCategory);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedCategory) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(updatedCategory);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const deletedCategory = await Category.findByIdAndDelete(req.params.id);

  if (!deletedCategory) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(204).send();
});