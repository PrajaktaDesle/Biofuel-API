import express from 'express';

import userController from '../../Controllers/User.controller';
import userSchema from '../../Constants/Schema/User.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/register',
    celebrate(userSchema.register),
    userController.register,
);

router.post(
    '/login',
    celebrate(userSchema.login),
    userController.login,
);

export default router;
