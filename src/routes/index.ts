import { Router } from 'express';
import userRoutes from './userRoutes.ts';
import categoryRoutes from './categoryRoutes.ts';
import productRoutes from './productRoutes.ts';

const router = Router();

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;