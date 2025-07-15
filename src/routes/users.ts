import { Router } from 'express';
import * as userController from '../controllers/users';

const router = Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/role', userController.changeRole);
router.put('/:id/toggle-active', userController.toggleActive);

export default router; 