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
);

router.post(
  '/all',
  productController.fetchAllProducts
);

router.put( 
  '/update',
  productController.updateProductById
);

router.get( 
  '/categories/all',
  productController.fetchAllProductCategories
);

router.get( 
  '/usage/units/all',
  productController.fetchAllProductUsageUnits
)
router.get(
  '/raw_materials/all',
  productController.fetchAllProductRawMaterials
)
router.get(
  '/packaging/all',
   productController.fetchAllProductPackaging
)

router.get(
  '/list/all',
   productController.fetchAllProductsList
)
export default router;
