import supplierController from '../../Controllers/Supplier.controller';
import supplierSchema from '../../Constants/Schema/Supplier.schema';
import express from 'express';
import path from 'path';
import {celebrate, celebrator} from 'celebrate';
const router = express.Router();

router.post(
  '/register',
  supplierController.register
);

router.post( 
  '/login',
  celebrate(supplierSchema.login),
  supplierController.login
);

router.post(
  '/verify-OTP',
  celebrate( supplierSchema.verify_otp),
  supplierController.verify_otp
);

router.put( 
  '/update',
  supplierController.updateSupplierDetails
);

router.get(
  '/fetch',
  celebrate( supplierSchema.fetchSupplierById ),
  supplierController.fetchSupplierById
);

router.post(
  '/fetch/all',
  supplierController.fetchAllSuppliers
);

router.get(
  '/home/page',
  supplierController.getHomePage
);
router.get(
    '/fetch/all/by-state',
    celebrate(supplierSchema.fetchSupplierByState),
    supplierController.fetchAllSuppliersByState
)
export default router;
