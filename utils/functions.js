const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

const configMulter = {
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1];
      cb(null, `${shortid.generate()}.${extension}`);
    }
  }),
  limits: {fileSize: 2000000},
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Format invalid'))
    }
  },
}

const upload = multer(configMulter).single('image');

module.exports.uploadImage = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      return res.status(500).json({ok: false, message: error});
    }
    return next();
  })
}


module.exports.fileExists = async (image) => {
  const pathFile = path.join(__dirname, `../uploads/${image}`);
  await fsPromise.access(pathFile, fs.constants.F_OK).catch(err => {
    throw err
  })
  return true
};


module.exports.removeImage = async (image) => {
  const pathFile = path.join(__dirname, `../uploads/${image}`);
  await fsPromise.unlink(pathFile).catch(err => {
    throw err
  })
  return true;
};