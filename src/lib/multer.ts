import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ensureDir } from '~/utils/esureDir';
import fsLib from './fs';

function getUniqueFileName(folderPath: string, baseName: string, ext: string): string {
  let fileName = baseName + ext;
  let counter = 1;

  while (fs.existsSync(path.join(folderPath, fileName))) {
    fileName = `${baseName}_v${counter}${ext}`;
    counter++;
  }

  return fileName;
}

const storageUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId; // Lấy từ URL param

    if (!userId) {
      return cb(new Error('Missing user_id'), '');
    }

    const uploadPath = path.join(fsLib.path.archive, userId);
    ensureDir(uploadPath);
    // Tạo thư mục nếu chưa tồn tại

    cb(null, uploadPath);
  },
  filename: (req: any, file: any, cb: any) => {
    const userId = req.params.userId;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext); // giữ nguyên tên gốc

    const uploadPath = path.join(fsLib.path.archive, userId);
    const uniqueName = getUniqueFileName(uploadPath, baseName, ext);

    cb(null, uniqueName);
  }
});

const multerLib = {
  storageUpload,
  getUniqueFileName
};

export default multerLib;
