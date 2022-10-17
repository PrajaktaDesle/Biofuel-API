import supplierController from '../../Controllers/Supplier.controller';
import express from 'express';
const multer = require('multer')
import path from 'path';
const router = express.Router();

router.post(
  '/register',
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
