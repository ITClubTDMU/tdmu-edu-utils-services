import { Router } from 'express';
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
  putDocumentInTrash
} from '~/controllers/edudoc.controller';
const router = Router();

router.get('/test', edudocTest);

// #region Document APIs
router.get('/documents', getListDocuments);
router.get('/documents/:id', getDocumentById);
router.post('/documents', createDocument);
router.delete('/documents/:id', deleteDocumentById);
router.put('/documents/:id', updateDocumentById);
router.put('/documents/:id/trash', putDocumentInTrash);
// #endregion

// #region Folder APIs
router.get('/folders', getListFolders);
router.get('/folders/:id', getFolderById);
router.post('/folders', createFolder);
router.delete('/folders/:id', deleteFolderById);
router.put('/folders/:id', updateFolderById);
// #endregion

export { router as edudocRouter };
