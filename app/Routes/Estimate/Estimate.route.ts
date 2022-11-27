import estimateController from '../../Controllers/Estimate.controller';
import estimateSchema from '../../Constants/Schema/Estimate.schema';
import express from 'express';
import path from 'path';
import { celebrate } from 'celebrate';
const router = express.Router();

router.post(
  '/create',
  celebrate( estimateSchema.createEstimate   ),
  estimateController.createEstimate
);


router.get( 
  '/fetch',
  celebrate( estimateSchema.fetchEstimateById ),
  estimateController.fetchEstimateById
);

router.get( 
  '/fetch/all',
  estimateController.fetchAllEstimates
);

router.put( 
  '/update',
  celebrate( estimateSchema.updateEstimate ),
  estimateController.udpateEstimate
);

// router.put( 
//   '/update/status',
//   estimateController.updateProductStatus
// );

// router.get( 
//   '/categories/all',
//   estimateController.fetchAllProductCategories
// );

// router.get( 
//   '/usage/units/all',
//   estimateController.fetchAllProductUsageUnits
// )

export default router;
