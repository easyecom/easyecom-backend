require('dotenv').config();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

try {
    const storageTypes = {
        local: multer.diskStorage({
            destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
            filename: (req, file, cb) => {
                crypto.randomBytes(16, (err, res) => {
                    if (err) cb(err);

                    file.key = `${res.toString('hex')}-${Date.now()}.jpg`;

                    cb(null, file.key);
                });
            },
        }),
        s3: multerS3({
            s3: new aws.S3(),
            bucket: 'ec-catalog-images',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            key: (req, file, cb) => {
                crypto.randomBytes(16, (err, res) => {
                    if (err) return cb(err);
                    return cb(null, `${res.toString('hex')}-${Date.now()}.jpg`);
                });
            },
        }),
    };

    module.exports = {
        storage: storageTypes['s3'],

        limits: {
            fileSize: 2 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            const allowedMimes = [
                'image/jpeg',
                'image/pjpeg',
                'image/png',
                'image/gif',
            ];

            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type.'));
            }
        },
    };
} catch (err) {
    console.log(error);
}
