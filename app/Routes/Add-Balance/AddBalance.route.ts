import express from 'express';

import addBalanceHistoryController from '../../Controllers/AddBalance.controller'
import addBalanceHistorySchema from '../../Constants/Schema/AddBalance.schema'

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(addBalanceHistorySchema.addBalance),
    addBalanceHistoryController.addBalance,
);

export default router;