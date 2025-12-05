import { Router } from 'express';
import multer from 'multer';
import {
  deleteDocumentById,
  createFolder,
  getListFolders,
  edudocTest,
  getDocumentById,
  getListDocuments,
  updateFolderById,
  updateDocumentById,
  createDocument,
  getFolderById,
  deleteFolderById,
  putDocumentInTrash,
  voteDocumentById,
  downVoteDocumentById,
  downloadDocumentById,
  getDocumentUserBadge
} from '~/controllers/edudoc.controller';
import multerLib from '~/lib/multer';
import { authMiddleware } from '~/middlewares/authMiddleware';
const router = Router();

// --- Use this configuration ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/test', edudocTest);

// #region Document APIs
router.get('/documents', authMiddleware, getListDocuments);
router.get('/documents/:id', authMiddleware, getDocumentById);
router.post('/documents', authMiddleware, upload.single('file'), createDocument);
router.delete('/documents/:id', authMiddleware, deleteDocumentById);
router.put('/documents/:id', authMiddleware, updateDocumentById);
router.put('/documents/:id/trash', authMiddleware, putDocumentInTrash);

// #endregion

// #region Folder APIs
router.get('/folders', getListFolders);
router.get('/folders/:id', getFolderById);
router.post('/folders', createFolder);
router.delete('/folders/:id', deleteFolderById);
router.put('/folders/:id', updateFolderById);
// #endregion

// #region Document Votes APIs
router.put('/documents/:id/upvote', authMiddleware, voteDocumentById);
router.put('/documents/:id/downvote', authMiddleware, downVoteDocumentById);
// #endregion

// #region Document Download APIs
router.post('/documents/:id/download', authMiddleware, downloadDocumentById);
// #endregion

// #region Document User Badge APIs
router.get('/user-badges', authMiddleware, getDocumentUserBadge);
// #endregion

export { router as edudocRouter };
