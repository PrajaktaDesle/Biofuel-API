import express from 'express';
import CPOController from '../../Controllers/CustomerPurchaseOrder.controller';
import CPOSchema from '../../Constants/Schema/CustomerPurchaseOrder.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/create',
    celebrate(CPOSchema.createCPO),
    CPOController.create
);

router.get(
    '/all',
    CPOController.fetchAllCustomers
);

router.get(
    '/fetch',
    celebrate(CPOSchema.fetchCPOById),
    CPOController.fetchCustomerById
);

router.put(
    '/update',
    celebrate(CPOSchema.updateCPOSDetails),
    CPOController.updateCustomerDetails
);

export default router;