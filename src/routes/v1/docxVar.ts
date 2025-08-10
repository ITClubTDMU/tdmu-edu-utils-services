import { Router } from 'express';
import multer from 'multer';
import { applyVar, uploadFile } from '~/controllers/docxVarController';
import multerLib from '~/lib/multer';

const router = Router();

const upload = multer({
  storage: multerLib.storageUpload
});

router.post('/upload/:userId', upload.single('file'), uploadFile);
router.post('/apply-var', applyVar);

export { router as docxVarRouter };
