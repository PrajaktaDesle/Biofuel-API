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

router.post(
    '/fetch/customers-details',
    celebrate(customerSchema.fetch),
    customerController.fetchCustomers
);
export default router;