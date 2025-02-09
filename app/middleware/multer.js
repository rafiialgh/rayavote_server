const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, 'public/uploads'); // Folder penyimpanan file
  // },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

// Middleware multer
const upload = multer({
  storage,
  fileFilter,
}).single('avatar');

module.exports = upload;
