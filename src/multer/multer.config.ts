import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: './uploads/avatars/users',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});