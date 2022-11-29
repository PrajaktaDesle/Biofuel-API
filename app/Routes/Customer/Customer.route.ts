import express from 'express';
import CustomerController from '../../Controllers/Customer.controller';
import CustomerScheman from '../../Constants/Schema/Customer.schema';
const router = express.Router();
import { celebrate } from 'celebrate';
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
);

router.get(
  '/fetch-all',
 CustomerController.fetchAllCustomers
);

// customer-supplier mapping
router.post(
  '/add',
  celebrate(CustomerScheman.customer_supplier),
  CustomerController.Create_customer_supplier
);

router.put(
  '/update/status',
  celebrate(CustomerScheman.updateStatus),
  CustomerController.updateCSMStatus
);

router.get(
  '/fetch/all',
  CustomerController.fetchAll_customers_suppliers
);

router.post(
    '/estimate/create',
    celebrate( CustomerScheman.createCustomerEstimate   ),
    CustomerController.createCustomerEstimate
  );
  
router.get( 
    '/estimate/fetch',
    celebrate( CustomerScheman.fetchCustomerEstimateById ),
    CustomerController.fetchCustomerEstimateById
  );
  
router.get( 
    '/estimate/fetch/all',
    CustomerController.fetchAllCustomerEstimates
  );
  
router.put( 
    '/estimate/update',
    celebrate( CustomerScheman.updateCustomerEstimate ),
    CustomerController.udpateCustomerEstimate
  );
  

export default router;