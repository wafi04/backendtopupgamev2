import { Router, Request, Response } from 'express';
import { getHealth } from '@/middleware/health';
import authRoutes from '@/services/auth/controller/route';
import CategoriesRoute from '@/services/categories/controller/categories';
import { subCategoriesController } from '@/services/categories/controller/subCategories';
import { MethodsRoutes } from '../services/methods/controller';
import { layananRoutes } from '@/services/layanan/controller';
import { sendMessageToQueue } from '@/lib/whatsapp/send';

const router: Router = Router();
const testSendMessage = async () => {
    const message = 'Test pesan WhatsApp';
    const phoneNumber = '123456789'; // Ganti dengan nomor yang sesuai
  
    for (let i = 0; i < 5; i++) {
      console.log(`Mengirim pesan ke ${phoneNumber} ke-${i + 1}`);
      await sendMessageToQueue('8990772533', message);
    }
  };
router.get('/', async(req: Request, res: Response) => {
    await testSendMessage()
    res.send('Service Ready to Accept Connection !!!');
});

router.get('/health', getHealth);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/categories',CategoriesRoute)
router.use('/api/v1/subcategories',subCategoriesController)
router.use('/api/v1/methods',MethodsRoutes)
router.use('/api/v1/layanans',layananRoutes)

export default router;