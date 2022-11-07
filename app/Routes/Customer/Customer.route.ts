import express from 'express';
import customerController from '../../Controllers/Customer.controller';
import customerSchema from '../../Constants/Schema/Customer.schema';
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/register',
    celebrate(customerSchema.register),
    customerController.register
);

router.get(
    '/all',
    customerController.fetchAllCustomers
);

router.get(
    '/fetch',
    celebrate(customerSchema.fetchCustomerById),
    customerController.fetchCustomerById
);

router.put(
    '/update',
    celebrate(customerSchema.updateCustomerDetails),
    customerController.updateCustomerDetails
);

export default router;