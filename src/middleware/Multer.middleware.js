// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { cloudinary } from '../config/cloudinary.config.js';

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'Hackhathon',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 500, height: 500, crop: 'limit' }],
//   },
// });

// const upload = multer({ storage });
// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
