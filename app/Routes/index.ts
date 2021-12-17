import  {Router} from 'express';
import userRoute from './user/User.route';
import customerRoute from './customer/Customer.route'

const router = Router();

router.use('/user', userRoute);
router.use('/customer', customerRoute);

export default router;
