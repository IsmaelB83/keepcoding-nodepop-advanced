const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/anuncios/');
    },
    filename: function(req, file, cb) {
        let aux = new Date().toLocaleString()
            .replace(new RegExp(' ', 'g'), '')
            .replace(new RegExp('/', 'g'), '')
            .replace(new RegExp(',', 'g'), '')
            .replace(new RegExp(':', 'g'), '');
        cb(null, `${aux}__${file.originalname}`);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // max 5MB
    }
});

module.exports = upload;