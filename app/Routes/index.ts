import  {Router} from 'express';
import userRoute from './User/User.route';
import customerRoute from './Customer/Customer.route';
import rdRoute from './Rd/Rd.route';
import tcRoute from './Transaction-config/TransConfig.route'
import fdRoute from './Fd/Fd.route'
import addBalanceRoute from './Add-Balance/AddBalance.route'

const router = Router();

router.use('/User', userRoute);
router.use('/Customer', customerRoute);
router.use('/Rd-transactions', rdRoute);
router.use('/Transaction-config',tcRoute)
router.use('/Fd-transactions',fdRoute)
router.use('/Add-fund',addBalanceRoute)

export default router;
