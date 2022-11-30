import addressController from '../../Controllers/Address.controller';
import express from 'express'
const router = express.Router();


router.get(
    '/cities/all',
    addressController.getAllCities
  );
  router.get(
    '/states/all',
    addressController.getAllStates
  );

export default router;
