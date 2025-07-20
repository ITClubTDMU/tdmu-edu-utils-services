import { Router } from 'express';
import { dkmhRouter } from './dkmhRoute';
import { checkDkmhToken } from '~/middlewares/checkDkmhToken';

const router = Router();


router.use('/dkmh', checkDkmhToken, dkmhRouter);

export { router as routerV1 };
