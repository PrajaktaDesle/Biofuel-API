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
router.post(
    '/all',
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
router.post(
    '/fetch/all/csm',
    CustomerController.fetchAllCSM
);

router.post(
    '/estimate/create',
    celebrate( CustomerSchema.createCustomerEstimate   ),
    CustomerController.createCustomerEstimate
);

router.get(
    '/estimate/fetch',
    celebrate( CustomerSchema.fetchCustomerEstimateById ),
    CustomerController.fetchCustomerEstimateById
);

router.get(
    '/estimate/fetch/all',
    CustomerController.fetchAllCustomerEstimates
);

router.put(
    '/estimate/update',
    celebrate( CustomerSchema.updateCustomerEstimate ),
    CustomerController.udpateCustomerEstimate

  );

router.post(
    '/sales/order/create',
    celebrate( CustomerSchema.createCustomerSalesOrder   ),
    CustomerController.createCustomerSalesOrder
);  

router.put( 
  '/sales/order/update',
  celebrate( CustomerSchema.updateCustomerSalesOrderById ),
  CustomerController.updateCustomerSalesOrder
);

router.get( 
  '/sales/order/fetch',
  celebrate( CustomerSchema.fetchCustomerSalesOrderById ),
  CustomerController.fetchCustomerSalesOrderById
);

router.get( 
  '/sales/order/fetch/all',
  CustomerController.fetchAllCustomerSalesOrders
);
router.get(
    '/fetch/map-suppliers',
    CustomerController.fetchAllSuppliersAgainstCustomer

);
router.get(
    '/fetch/active',
    CustomerController.fetchAllActiveCustomers

);
export default router;
