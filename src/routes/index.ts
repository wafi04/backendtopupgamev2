import { Router, Request, Response } from 'express';
import { getHealth } from '../middleware/health';
import authRoutes from '@/services/auth/controller/route';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server berjalan!');
});

router.get('/health', getHealth);
router.use('/api/auth',authRoutes)




export default router;