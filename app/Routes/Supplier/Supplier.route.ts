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
router.post(
  '/po/fetch/all',
  supplierController.fetchAllSupplierPO
);
router.put( 
  '/po/update/status',
  celebrate(supplierSchema.updateSupplierPOStatus),
  supplierController.updateSupplierPO
)
router.post(
    '/create/delivery-challan',
    celebrate(supplierSchema.generateChallan),
    supplierController.createChallan
)
router.post(
    '/fetch/all/challan',
    supplierController.fetchAllChallan
)
router.put(
    '/update/challan-status/',
    supplierController.updatechallanStatus
)
router.get(
  '/fetch/list',
  supplierController.fetchAllSuppliersList
)
router.post(
  '/po/create',
  supplierController.createSupplierPO
)
// fetchSupplierPOById
router.get(
  '/po/fetch',
  supplierController.fetchSupplierPOById
)
router.get(
    '/po/fetch/supplier-id/',
    supplierController.fetchSupplierPOBySupplierId
)
router.put( 
  '/po/update',
  supplierController.updateSupplierPO
)
router.post(
    '/payment/notify-quantity',
    supplierController.addSupplierPayment
)
router.get(
    '/fetch/approved/challan',
    supplierController.fetchApprovedChallan
)
router.put(
    '/update/payment/',
    // celebrate(supplierSchema.updateSupplierPayment),
    supplierController.updatesupplierPayment
)
router.get(
    '/fetch/all/spo-number/',
    supplierController.fetchAllSPONumber
)
router.get(
    '/fetch/all/notifications/',
    celebrate(supplierSchema.fetchNotificatonsBySupplierById),
    supplierController.fetchAllNotificationsBySupplierID

)
router.get(
    '/fetch/all/payments/',
    celebrate(supplierSchema.fetchAllPaymentsSupplierById),
    supplierController.fetchAllPaymentsBySupplierID

)
export default router;
