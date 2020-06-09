import multer from 'multer';
import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb) => {
            cb(
                null,
                `${file.fieldname}-${Date.now()}${path.extname(
                    file.originalname
                )}`
            );
        },
    }),
};
