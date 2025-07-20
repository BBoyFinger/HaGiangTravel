import { Router } from 'express';
import userController from '../controllers/users';
import messageController from '../controllers/messages';
import express from 'express';

const router = Router();
const messageRouter = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/role', userController.changeRole);
router.put('/:id/toggle-active', userController.toggleActive);
router.get('/:id/wishlist', userController.getWishlist);
router.post('/:id/wishlist', userController.addToWishlist);
router.delete('/:id/wishlist/:tourId', userController.removeFromWishlist);
router.get('/chat/:userId', messageController.getChatHistory);
router.post('/chat/send', messageController.sendMessage);
router.get('/admin', userController.getAdmin);
messageRouter.get('/users', messageController.getChatUsers);

export { messageRouter };
export default router; 