import express from 'express';

import customerController from '../../Controllers/Customer.controller';
import customerSchema from '../../Constants/Schema/Customer.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

// router.post(
//     '/register',
//     celebrate(custSchema.register),
//     custController.register,
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


export default router;
