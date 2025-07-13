import { Router } from 'express';
import * as tourController from '../controllers/tours';
import uploadTourImage from "../middleware/uploadTourImage";

const router = Router();

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTourById);
router.post('/', uploadTourImage.array('images', 10), tourController.createTour);
router.put('/:id', uploadTourImage.array('images', 10), tourController.updateTour);
router.delete('/:id', tourController.deleteTour);

export default router; 