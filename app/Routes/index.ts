import  {Router} from 'express';
import userRoute from './user/User.route';
import customerRoute from './customer/Customer.route';
import rdRoute from './rd/Rd.route';
import tcRoute from './transaction.config/TransConfig.route'
import fdRoute from './Fd/Fd.route'

const router = Router();

router.use('/user', userRoute);
router.use('/customer', customerRoute);
router.use('/rd-transactions', rdRoute);
router.use('/transaction-config',tcRoute)
router.use('/fd-transaction',fdRoute)

export default router;
