import { Router } from 'express';
import * as commentController from '../controllers/comments';
// Đảm bảo import đúng kiểu

const router = Router();

router.get('/', commentController.getAllComments);
router.post('/', commentController.createComment);
router.put('/:id/approve', commentController.approveComment);
router.put('/:id/reject', commentController.rejectComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

export default router; 