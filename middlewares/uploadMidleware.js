const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");

const FILE_DIR = path.resolve("./tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR);
  },
  filename: (req, file, cb) => {
    const [filename, extention] = file.originalname.split(".");
    cb(null, `${filename}.${extention}`);
  },
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;
