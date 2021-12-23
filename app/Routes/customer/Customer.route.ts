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
    celebrate(customerSchema.fetch),
    customerController.fetchCustomers
);
router.get(
    '/',
    celebrate(customerSchema.select),
    customerController.selectCustomer
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


export default router;