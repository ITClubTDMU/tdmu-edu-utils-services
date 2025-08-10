import { Router } from 'express';

import { getHocKy, ketQuaHocTap, login, studentInfo, tkbTuanHocKy } from '~/controllers/dkmhController';
import { isExpireDkmhToken } from '~/middlewares/checkDkmhToken';

const router = Router();

router.post('/login', login);
router.post('/tkbtuanhocky', tkbTuanHocKy, isExpireDkmhToken);
router.post('/getHocKy', getHocKy, isExpireDkmhToken);
router.post('/studentInfo', studentInfo, isExpireDkmhToken);
router.post('/ketQuaHocTap', ketQuaHocTap, isExpireDkmhToken);

export { router as dkmhRouter };
