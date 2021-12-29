import express from 'express';

import userController from '../../Controllers/User.controller';
import userSchema from '../../Constants/Schema/User.schema';

const router = express.Router();
import { celebrate } from 'celebrate';
import customerSchema from "../../Constants/Schema/Customer.schema";
import customerController from "../../Controllers/Customer.controller";

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
router.get(
    '/all',
    celebrate(userSchema.fetch),
    userController.fetchUsers
);

export default router;