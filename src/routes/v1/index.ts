import { Router } from 'express';
import { dkmhRouter } from './dkmhRoute';
import { checkDkmhToken } from '~/middlewares/checkDkmhToken';
import { docxVarRouter } from './docxVar';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { timeTableRouter } from './timeTableRoute';
import { workspaceRouter } from './workspaceRoute';
import { mapRouter } from './map.route';
import { newsRouter } from './news.route';
import { edudocRouter } from './edudoc.route';
import { workflowRouter } from './workflow.route';
import { userRouter } from './user.route';
const router = Router();

router.use('/dkmh', checkDkmhToken, dkmhRouter);
router.use('/docx-var', docxVarRouter);
router.use('/time-table', authMiddleware, timeTableRouter);
router.use('/workspace', workspaceRouter);
router.use('/workspaces', workspaceRouter);
router.use('/map', mapRouter);
router.use('/news', newsRouter);
router.use('/edudoc', edudocRouter);
router.use('/workflow', authMiddleware, workflowRouter);
router.use('/users', userRouter);
router.get('/test2', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

export { router as routerV1 };
