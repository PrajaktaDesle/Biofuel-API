import supplierController from '../../Controllers/Supplier.controller';
import supplierSchema from '../../Constants/Schema/Supplier.schema';
import express from 'express';
import path from 'path';
import { celebrate } from 'celebrate';
const router = express.Router();

router.post(
  '/register',
  supplierController.register
);

router.post( 
  '/login',
  celebrate(supplierSchema.login),
  supplierController.login
)

router.post(
  '/verify-OTP',
  celebrate( supplierSchema.verify_otp),
  supplierController.verify_otp

)
router.put(
  '/update',
  supplierController.formidableUpdateDetails
)

router.put( 
  '/update/status',
  celebrate( supplierSchema.updateSupplierStatus ),
  supplierController.updateSuppliersDetails
)

router.get(
  '/fetch',
  celebrate( supplierSchema.fetchSupplierById ),
  supplierController.fetchSupplierById
)

router.get(
  '/fetch/all',
  supplierController.fetchAllSuppliers
)

export default router;
