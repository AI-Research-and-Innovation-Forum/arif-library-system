import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'library-books',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 700, crop: 'limit' }],
  },
});

const upload = multer({ storage: storage });

export default upload; 