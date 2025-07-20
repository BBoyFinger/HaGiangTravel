import express from 'express';
import {
  getAllCarouselSlides,
  getAllCarouselSlidesAdmin,
  getCarouselSlide,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
  updateSlideOrder
} from '../controllers/heroCarousel';
import { requireAdmin } from '../middleware/admin';
import { authMiddleware } from '../middleware/auth';
import uploadSlideImage from '../middleware/uploadSlideImage';

const router = express.Router();

// Public routes
router.get('/', getAllCarouselSlides);

// Admin routes
router.get('/admin', authMiddleware, requireAdmin, getAllCarouselSlidesAdmin);
router.get('/:id', authMiddleware, requireAdmin, getCarouselSlide);
router.post('/', authMiddleware, requireAdmin, uploadSlideImage.single('image'), createCarouselSlide);
router.put('/:id', authMiddleware, requireAdmin, uploadSlideImage.single('image'), updateCarouselSlide);
router.delete('/:id', authMiddleware, requireAdmin, deleteCarouselSlide);
router.put('/order/update', authMiddleware, requireAdmin, updateSlideOrder);

export default router; 