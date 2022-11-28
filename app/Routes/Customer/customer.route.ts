import express from "express"
import {celebrate} from "celebrate";
import CustomerController from "../../Controllers/Customer.controller"
const router = express.Router()

router.post(
    '/create',
       CustomerController.Create
);
router.get(
    '/fetch',
   CustomerController.fetchCustomerById
);
router.put(
    '/update',
     CustomerController.updateCustomerDetails
)
router.put(
    '/update/customer-status',
   CustomerController.updateCustomerStatus
)
router.get(
    '/fetch-all',
   CustomerController.fetchAllCustomers
)
// customer-supplier mapping
router.post(
    '/add',
    // celebrate(customer_supplier_mapSchema.customer_supplier),
    CustomerController.Create_customer_supplier
);
router.put(
    '/update/status',
    // celebrate(customer_supplier_mapSchema.updateStatus),
    CustomerController.updateCSMStatus
);
router.get(
    '/fetch/all',
    CustomerController.fetchAll_customers_suppliers
);

export default router;
