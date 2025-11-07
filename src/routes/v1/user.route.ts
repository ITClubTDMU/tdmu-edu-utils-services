import { Router } from 'express';
import { getUserById, searchUsers } from '~/controllers/user.controller';

const router = Router();

router.get('/search', searchUsers);
router.get('/:id', getUserById);

export { router as userRouter };