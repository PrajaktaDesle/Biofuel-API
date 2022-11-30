import addressController from '../../Controllers/Address.controller';
import addressSchema from '../../Constants/Schema/Address.schema';
import express from 'express'
import { celebrate } from 'celebrate';
const router = express.Router();


router.get(
    '/cities/all',
    addressController.getAllCities
  );
router.get(
    '/states/all',
    addressController.getAllStates
  );
router.get(
    '/cities-by-state',
    celebrate( addressSchema.citiesByState ),
    addressController.getCitiesByState
  );

export default router;
