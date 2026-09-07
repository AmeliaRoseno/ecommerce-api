import { Router } from 'express';
import userRoutes from './userRoutes.ts';
import categoryRoutes from './categoryRoutes.ts';

const router = Router();

router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

export default router;