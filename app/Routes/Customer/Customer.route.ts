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

router.get(
    '/',
    celebrate(customerSchema.fetchCustomerById),
    customerController.fetchCustomerById
);

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
    '/put-mobile',
    celebrate(customerSchema.updateCustomerById),
    customerController.updateCustomerById
);

router.put(
    '/put-status',
    celebrate(customerSchema.updateCustomerStatus),
    customerController.updateCustomerStatus
);

export default router;