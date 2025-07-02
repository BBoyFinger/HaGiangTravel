import { Router } from 'express';
import * as accommodationController from '../controllers/accommodations';
import upload from "../middleware/uploadImage";

const router = Router();

router.get('/', accommodationController.getAllAccommodations);
router.get('/slug/:slug', accommodationController.getAccommodationBySlug);
router.get('/:id', accommodationController.getAccommodationById);
router.post('/', accommodationController.createAccommodation);
router.put('/:id', accommodationController.updateAccommodation);
router.delete('/:id', accommodationController.deleteAccommodation);
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