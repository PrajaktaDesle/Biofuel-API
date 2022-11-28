import  {Router} from 'express';
import customerRoute from './Customer/Customer.route';
import supplierRoute from './Supplier/Supplier.route';
import adminRoute from './Admin/Admin.route';
import productRoute from './Product/Product.route';
import notificationRoute from './Notification/Notification.route';
import customerPORoute from './CustomerPurchaseOrder/CustomerPurchaseOrder.route'
import estimateRoute from './Estimate/Estimate.route'
import customerOnboardRoute from "./CustomerOnboard/customerOnboard.route"
import CSMRoute from './customer-supplier_mapping/customer_supplier-mapping.route'
const router = Router();

router.use('/customer', customerRoute);
router.use('/supplier', supplierRoute);
router.use('/admin', adminRoute);
router.use( '/product', productRoute);
router.use( '/notification', notificationRoute );

router.use( '/customerPO', customerPORoute );
router.use( '/estimate', estimateRoute );
router.use( '/customers', customerOnboardRoute )
router.use( '/customer-supplier-mapping',CSMRoute  )

export default router;
