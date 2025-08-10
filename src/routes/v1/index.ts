import { Router } from 'express';
import { dkmhRouter } from './dkmhRoute';
import { checkDkmhToken } from '~/middlewares/checkDkmhToken';
import { docxVarRouter } from './docxVar';

const router = Router();

router.use('/dkmh', checkDkmhToken, dkmhRouter);
router.use('/docx-var', docxVarRouter);

export { router as routerV1 };
