import  {Router} from 'express';
import userRoute from './user/User.route';
import customerRoute from './customer/Customer.route';
import rdRoute from './rd/Rd.route';

const router = Router();

router.use('/user', userRoute);
router.use('/customer', customerRoute);
router.use('/rd-transactions', rdRoute);

export default router;
