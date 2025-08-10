import fs from 'fs';

const ensureDir = (dir: fs.PathLike) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export { ensureDir };
