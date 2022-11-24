import express from "express"
import CSMController from "../../Controllers/customer_supplier_mapping.controller"
import { celebrate } from 'celebrate';
import customer_supplier_mapSchema from "../../Constants/Schema/customer_supplier_map.schema";
const router = express.Router()


router.post(
    '/add',
    // celebrate(customer_supplier_mapSchema.customer_supplier),
    CSMController.CreateCustSuppMapping
);
router.put(
    '/update/status',
    // celebrate(customer_supplier_mapSchema.updateStatus),
    CSMController.updateCSMStatus
);
router.get(
    '/fetch',
    CSMController.fetchAll_customers_suppliers
);
export default router