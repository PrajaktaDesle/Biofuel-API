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

router.get( 
  '/fetch',
  productController.fetchProductById
)

router.put( 
  '/update',
  productController.updateProductById
)

export default router;
