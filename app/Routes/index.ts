import  {Router} from 'express';
import customerRoute from "./Customer/Customer.route"
import supplierRoute from './Supplier/Supplier.route';
import adminRoute from './Admin/Admin.route';
import productRoute from './Product/Product.route';
import notificationRoute from './Notification/Notification.route';
import addressRoute from './Address/Address.route'
const router = Router();

router.use('/customer', customerRoute);
router.use('/supplier', supplierRoute);
router.use('/admin', adminRoute);
router.use( '/product', productRoute);
router.use( '/notification', notificationRoute );
router.use( '/address', addressRoute );
export default router;
