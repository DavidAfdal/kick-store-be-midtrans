import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
      cb(new Error('File type is not support'), false);
      return;
    }
    cb(null, true);
  },
});
