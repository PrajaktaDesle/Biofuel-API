import productController from '../../Controllers/Product.controller';
import productSchema from '../../Constants/Schema/Product.schema';
import express from 'express';
import path from 'path';
import { celebrate } from 'celebrate';
const router = express.Router();

router.post(
  '/create',
  productController.createProduct
);

export default router;
