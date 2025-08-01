import { Router } from 'express';
import * as bookingController from '../controllers/bookings';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, bookingController.getAllBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.post('/', authMiddleware, bookingController.createBooking);
router.put('/:id', authMiddleware, bookingController.updateBooking);
router.delete('/:id', authMiddleware, bookingController.deleteBooking);

export default router;
