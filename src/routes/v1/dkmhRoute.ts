import { Router } from 'express';

import { login, tkbTuanHocKy } from '~/controllers/dkmhController';

const router = Router();

router.post('/login', login);
router.post('/tkbtuanhocky', tkbTuanHocKy);
export { router as dkmhRouter };
