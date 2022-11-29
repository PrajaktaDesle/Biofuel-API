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
  celebrate( supplierSchema.updateSupplierStatus ),
  supplierController.updateSupplierDetails
)

router.get(
  '/fetch',
  celebrate( supplierSchema.fetchSupplierById ),
  supplierController.fetchSupplierById
);

router.get(
  '/fetch/all',
  supplierController.fetchAllSuppliers
);

router.get(
  '/fetch/city/state',
  supplierController.getAllCityWiseStates
);

router.get(
  '/cities/all',
  supplierController.getAllCities
);
router.get(
  '/states/all',
  supplierController.getAllStates
);

router.get(
  '/home/page',
  supplierController.getHomePage
);

export default router;
