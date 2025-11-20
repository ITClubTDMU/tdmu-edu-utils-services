import { Router } from 'express';
import {
  getNewsFeed,
  getPageProfiles,
  getPagesInfo,
  getPostImages,
  getFavoriteProfiles,
  addFavoriteProfile,
  removeFavoriteProfile,
  getTagsNews,
  getPinnedNews
} from '~/controllers/news.controller';
import { authMiddleware } from '~/middlewares/authMiddleware';

const router = Router();

router.post('/', getNewsFeed);
router.get('/pinned', getPinnedNews);
router.post('/with-favorite', authMiddleware, getNewsFeed);
router.get('/page-profiles', getPageProfiles);
router.get('/tags', getTagsNews);
router.get('/page-profiles/with-favorite', authMiddleware, getPageProfiles);
router.get('/post-images/:post_id', getPostImages);
router.get('/pages-info', getPagesInfo);
router.get('/favorite-profiles', authMiddleware, getFavoriteProfiles);
router.post('/favorite-profiles/:profileShortName', authMiddleware, addFavoriteProfile);
router.delete('/favorite-profiles/:profileShortName', authMiddleware, removeFavoriteProfile);
export { router as newsRouter };
