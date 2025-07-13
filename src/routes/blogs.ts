import { Router } from 'express';
import * as blogController from '../controllers/blogs';
import uploadBlogImage from "../middleware/uploadBlogImage";

const router = Router();


router.get('/', blogController.getAllBlogs);

router.get('/slug/:slug', blogController.getBlogBySlug);

router.get('/:id', blogController.getBlogById);

router.post('/', uploadBlogImage.array('images', 10), blogController.createBlog);

router.put('/:id', uploadBlogImage.array('images', 10), blogController.updateBlog);

router.delete('/:id', blogController.deleteBlog);

export default router; 