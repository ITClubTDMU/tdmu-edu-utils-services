import { Router } from 'express';
import { getNewsFeed, getPageProfiles, getPostImages } from '~/controllers/news.controller';

const router = Router();

router.post('/', getNewsFeed);
router.get('/page-profiles', getPageProfiles);
router.get('/post-images', getPostImages);
export { router as newsRouter };
