import { Router, Request, Response } from 'express';
import { getHealth } from '../middleware/health';
import authRoutes from '@/services/auth/controller/route';
import CategoriesRoute from '@/services/categories/controller/categories';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server Is Running!');
});

router.get('/health', getHealth);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/categories',CategoriesRoute)

export default router;