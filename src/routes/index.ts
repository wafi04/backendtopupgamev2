import { Router, Request, Response } from 'express';
import { getHealth } from '@/middleware/health';
import authRoutes from '@/services/auth/controller/route';
import CategoriesRoute from '@/services/categories/controller/categories';
import { subCategoriesController } from '@/services/categories/controller/subCategories';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Diubah!');
});

router.get('/health', getHealth);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/categories',CategoriesRoute)
router.use('/api/v1/subcategories',subCategoriesController)

export default router;