import express from "express"
import {celebrate} from "celebrate";
import CustomerController from "../../Controllers/Customer.controller"
import CustomerSchema from "../../Constants/Schema/Customer.schema";
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
router.get(
    '/fetch-all',
   CustomerController.fetchAllCustomers
)
// customer-supplier mapping
router.post(
    '/add',
    celebrate(CustomerSchema.customer_supplier),
    CustomerController.Create_customer_supplier
);
router.put(
    '/update/status',
    celebrate(CustomerSchema.updateStatus),
    CustomerController.updateCSMStatus
);
router.get(
    '/fetch/all',
    CustomerController.fetchAll_customers_suppliers
);

export default router;
