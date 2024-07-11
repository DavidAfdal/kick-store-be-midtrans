import multer from 'multer';
import path from 'path';
import HttpError from '../utils/httpError.js';

export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    console.log(file);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp' && ext !== '.jfif') {
      cb(new HttpError('File type is not supported', 400), false);
      return;
    }
    cb(null, true);
  },
});