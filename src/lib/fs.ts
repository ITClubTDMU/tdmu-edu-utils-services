import fs from 'fs';
import path from 'path';

const fsLib = {
  path: {
    archive: 'archive'
  },
  ensureDir: (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  },
  publicArchivePath: (userId?: string) => {
    return '/public/archive' + (userId ? `/${userId}` : '');
  }
};

export default fsLib;
