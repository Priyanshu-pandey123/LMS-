const multer = require("multer");
const path = require("path");
console.log("enter into the multer");
const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 50 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: "uploads",
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // Normalize extension
    if (![".jpg", ".jpeg", ".webp", ".png"].includes(ext)) {
      return cb(new Error(`Unsupported file type: ${ext}`), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
