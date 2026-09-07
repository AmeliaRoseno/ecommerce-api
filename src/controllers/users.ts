import type { Request, Response } from 'express';
import { User } from '../models/index.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';

// GET /users
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// GET /users/:id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// POST /users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const newUser = await User.create(req.body);
  const { password, ...userWithoutPassword } = newUser.toObject();
  res.status(201).json(userWithoutPassword);
});

// PUT /users/:id
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select('-password');

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(updatedUser);
});

// DELETE /users/:id
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(204).send();
});