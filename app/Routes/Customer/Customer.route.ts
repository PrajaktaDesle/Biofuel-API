import express from 'express';
import customerController from '../../Controllers/Customer.controller';
import customerSchema from '../../Constants/Schema/Customer.schema';
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/estimate/create',
    celebrate( customerSchema.createCustomerEstimate   ),
    customerController.createCustomerEstimate
  );
  
router.get( 
    '/estimate/fetch',
    celebrate( customerSchema.fetchCustomerEstimateById ),
    customerController.fetchCustomerEstimateById
  );
  
router.get( 
    '/estimate/fetch/all',
    customerController.fetchAllCustomerEstimates
  );
  
router.put( 
    '/estimate/update',
    celebrate( customerSchema.updateCustomerEstimate ),
    customerController.udpateCustomerEstimate
  );
  

export default router;