import express from 'express';
import customerPOController from '../../Controllers/CustomerPurchaseOrder.controller';
import customerPOSchema from '../../Constants/Schema/CustomerPurchaseOrder.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/create',
    celebrate(customerPOSchema.createCPO),
    customerPOController.createCustomerPO
);

router.get(
    '/all',
    customerPOController.fetchAllCustomerPO
);

router.get(
    '/fetch',
    celebrate(customerPOSchema.fetchCPOById),
    customerPOController.fetchCustomerPOById
);

router.put(
    '/update',
    celebrate(customerPOSchema.updateCPODetails),
    customerPOController.updateCustomerPODetails
);

export default router;