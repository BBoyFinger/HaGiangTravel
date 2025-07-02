import { Router } from 'express';
import * as blogController from '../controllers/blogs';
import upload from "../middleware/uploadImage";

const router = Router();


router.get('/', blogController.getAllBlogs);

router.get('/slug/:slug', blogController.getBlogBySlug);

router.get('/:id', blogController.getBlogById);

router.post('/', blogController.createBlog);

router.put('/:id', blogController.updateBlog);

router.delete('/:id', blogController.deleteBlog);

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