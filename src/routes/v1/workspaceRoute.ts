import { Router } from 'express';
import multer from 'multer';
import { deleteFile, updateFile, uploadFile } from '~/controllers/workspaceController';

const router = Router();

const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), uploadFile);

// router.get("/file/:filePath", getFile);
router.put('/file', upload.single('file'), updateFile);
router.delete('/delete', deleteFile);

export { router as workspaceRouter };
