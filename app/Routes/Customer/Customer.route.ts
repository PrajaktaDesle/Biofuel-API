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
    celebrate(CustomerSchema.addCustomerSupplierMapping),
    CustomerController.addCustomerSupplierMapping
);
router.put(
    '/update/mapping/status',
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

router.post(
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

router.post( 
  '/sales/order/fetch/all',
  CustomerController.fetchAllCustomerSalesOrders
);
router.post(
    '/fetch/map-suppliers',
    celebrate(CustomerSchema.getsuppliersByCustomerId),
    CustomerController.fetchAllSuppliersAgainstCustomer

);
router.get(
    '/fetch/list',
    CustomerController.fetchAllCustomersList
);

router.get(
    '/fetch/active',
    CustomerController.fetchAllActiveCustomers

);
router.get(
    '/fetch/suppliers',
    celebrate(CustomerSchema.getsuppliers),
    CustomerController.fetchAllMappedSuppliersByAddressID

);
router.get(
    '/fetch/so/list',
    CustomerController.fetchAllCustomersSOList
);
router.get(
    '/fetch/sales/order/list',
    CustomerController.fetchAllCSOList
);
router.post(
    '/mapped/suppliers/by/customer_id',
    CustomerController.fetchAllMappedSuppliersByCustomerId
)
router.get(
    '/estmateNumber/exists',
    CustomerController.estimateNoExistsOrNot
)

router.get(
    '/salesOrderNumber/exists',
    CustomerController.salesOrderNoExistsOrNot
)
export default router;
