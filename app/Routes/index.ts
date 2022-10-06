import  {Router} from 'express';
import userRoute from './User/User.route';
import customerRoute from './Customer/Customer.route';
// import supplierRoute from './Supplier/Supplier.route'


const router = Router();

router.use('/User', userRoute);
router.use('/Customer', customerRoute);

export default router;
