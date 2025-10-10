import { Router } from 'express';
import { getLocations } from '~/controllers/map.controller';

const router = Router();

router.get('/locations', getLocations);

export { router as mapRouter };
