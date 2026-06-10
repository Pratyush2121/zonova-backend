import * as multerModule from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const multer = multerModule.default || multerModule;

const getCurrentDir = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
};
const UPLOAD_DIR = path.join(getCurrentDir(), '../uploads');

// Create upload directory if not exists
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory (this is normal in serverless/read-only runtimes):", error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif|svg/;
  const allowedDocTypes = /pdf|doc|docx/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = allowedImageTypes.test(ext) || allowedImageTypes.test(file.mimetype);
  const isDoc = allowedDocTypes.test(ext) || allowedDocTypes.test(file.mimetype);

  if (file.fieldname === 'resume') {
    if (isDoc) {
      cb(null, true);
    } else {
      cb(new Error('Resumes must be in PDF, DOC, or DOCX formats!'), false);
    }
  } else {
    if (isImage) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG, WEBP, GIF, SVG) are allowed!'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default upload;
