import { Router } from 'express';
import { dkmhRouter } from './dkmhRoute';
import { checkDkmhToken } from '~/middlewares/checkDkmhToken';
import { docxVarRouter } from './docxVar';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { timeTableRouter } from './timeTableRoute';
import { workspaceRouter } from './workspaceRoute';
import { mapRouter } from './map.route';

const router = Router();

router.use('/dkmh', checkDkmhToken, dkmhRouter);
router.use('/docx-var', docxVarRouter);
router.use('/time-table', authMiddleware, timeTableRouter);
router.use('/workspace', workspaceRouter);
router.use('/workspaces', workspaceRouter);
router.use('/map', mapRouter);

router.get('/test2', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

export { router as routerV1 };
