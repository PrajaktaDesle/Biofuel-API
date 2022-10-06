import express from 'express';
import customerController from '../../Controllers/Customer.controller';
import customerSchema from '../../Constants/Schema/Customer.schema';
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/register',
    // celebrate(customerSchema.register),
    customerController.register
);

router.get(
    '/all',
    celebrate(customerSchema.fetchAllCustomers),
    customerController.fetchAllCustomers
);

// router.get(
//     '/',
//     celebrate(customerSchema.fetchCustomerById),
//     customerController.fetchCustomerById
// );

router.post(
    '/login',
    celebrate(customerSchema.login),
    customerController.login,
);

router.post(
    '/verify-OTP',
    celebrate(customerSchema.verify_otp),
    customerController.verify_otp,
);
router.put(
    '/put-details',
    celebrate(customerSchema.updateCustomerDetails),
    customerController.updateCustomerDetails
);

// router.get(
//     '/transaction-history',
//     celebrate(customerSchema.fetchTransactionHistoryById),
//     customerController.fetchTransactionHistoryById
// );

router.put(
    '/formidable/put-details',
    // celebrate(customerSchema.register),
    customerController.formidableUpdateDetails
);

export default router;