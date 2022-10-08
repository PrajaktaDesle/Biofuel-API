import supplierController from '../../Controllers/Supplier.controller';
import customerSchema from '../../Constants/Schema/Customer.schema';
import validate from '../../Constants/validate'
import { nextTick } from 'process';
import express from 'express';
const multer = require('multer')
import path from 'path';
const { celebrate, Joi, Segments } = require('celebrate');
const router = express.Router();
const multerS3 = require('multer-s3');
const storage = multer.diskStorage({
  //@ts-ignore
  destination: function (req, file, cb) {
    cb(null, '../uploads/images')
  },
  //@ts-ignore
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const AWS_BUCKET_REGION = "ap-south-1"
const AWS_ACCESS_KEY = "AKIA4FVNO3EYUANR25WJ"
const AWS_SECRET_KEY = "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"

//   const upload = multer({ storage: storage })

import AWS from 'aws-sdk';
const s3 = new AWS.S3({
  //@ts-ignore
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY
});

//@ts-ignore
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

var upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: "digi-qa-s3",
    //@ts-ignore
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname); //use Date.now() for unique file keys
    }
  })
});

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'public/images',
  //@ts-ignore
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  //@ts-ignore
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})

router.post(
  '/register',
  // imageUpload.single('pan_img'),
  upload.fields([{name:'aadhar_img'}, {name:'pan_img'}, {name:'gst_img'}]),
  // imageUpload.fields([{name:'aadhar_img'}, {name:'pan_img'}, {name:'gst_img'}]),
  //@ts-ignore
  (req, res, next) => {
    //@ts-ignore
    var file = req.files
    var body = req.body
    console.log( "request files and body : ", file, body )
    // res.send(file)
    next()
  },
  //@ts-ignore
  // (error, req, res, next) => {
  //   res.status(400).send({ error: error.message })
  // }
    supplierController.register
);

router.put(
  '/update',
  supplierController.formidableUpdateDetails
)

router.get(
  '/fetch',
  supplierController.fetchSupplierById
)

router.get(
  '/fetch/all',
  supplierController.fetchAllSuppliers
)

export default router;  