import  {Router} from 'express';
import userRoute from './user/User.route';

const router = Router();

router.use('/user', userRoute);

export default router;
