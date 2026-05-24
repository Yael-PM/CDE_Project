import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Formato de imagen no permitido'));
  }

  cb(null, true);
};

export const uploadNoteImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});