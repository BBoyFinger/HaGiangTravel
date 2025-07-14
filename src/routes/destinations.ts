import { Router } from 'express';
import * as destinationController from '../controllers/destinations';
import uploadDestinationImage from "../middleware/uploadDestinationImage";

const router = Router();

router.get('/', destinationController.getAllDestinations);
router.get('/:slug', destinationController.getDestinationBySlug);
router.get('/:id', destinationController.getDestinationById);
router.post('/', destinationController.createDestination);
router.put('/:id', uploadDestinationImage.array('images', 10), destinationController.updateDestination);
router.delete('/:id', destinationController.deleteDestination);
router.post("/upload-image", uploadDestinationImage.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.json({ url: req.file.path });
});
router.post("/upload-images", uploadDestinationImage.array("images", 10), (req, res) => {
  if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }
  const urls = req.files.map((file) => file.path);
  res.json({ urls });
});

export default router; 