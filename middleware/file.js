const multer = require('multer');

// куда и как загружать файлы на сервер
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = function (req, file, cb) {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({ storage, fileFilter });
