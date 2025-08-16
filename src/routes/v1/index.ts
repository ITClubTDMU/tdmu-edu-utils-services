import { Router } from 'express';
import { dkmhRouter } from './dkmhRoute';
import { checkDkmhToken } from '~/middlewares/checkDkmhToken';
import { docxVarRouter } from './docxVar';
import { authMiddleware } from '~/middlewares/authMiddleware';

const router = Router();

router.use('/dkmh', checkDkmhToken, dkmhRouter);
router.use('/docx-var', docxVarRouter);

router.get('/test2', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

export { router as routerV1 };
