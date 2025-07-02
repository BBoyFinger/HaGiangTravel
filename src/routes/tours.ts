import { Router } from 'express';
import * as tourController from '../controllers/tours';
import upload from "../middleware/uploadImage";

const router = Router();

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTourById);
router.post('/', tourController.createTour);
router.put('/:id', tourController.updateTour);
router.delete('/:id', tourController.deleteTour);
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.json({ url: req.file.path });
});
router.post("/upload-images", upload.array("images", 10), (req, res) => {
  if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }
  const urls = req.files.map((file) => file.path);
  res.json({ urls });
});

export default router; 