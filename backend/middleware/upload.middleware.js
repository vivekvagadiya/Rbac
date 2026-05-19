const multer = require("multer");

// MEMORY STORAGE
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  // FILE SIZE LIMIT
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // FILE TYPE VALIDATION
  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only image files are allowed"),
        false
      );
    }

    cb(null, true);
  },
});

module.exports = upload;