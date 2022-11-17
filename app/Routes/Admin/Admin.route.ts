import adminController from '../../Controllers/Admin.controller';
import adminSchema from '../../Constants/Schema/Admin.schema';
import path from 'path';
import express from 'express'
import { celebrate } from 'celebrate';
const router = express.Router();

router.post(
    '/login',
    celebrate( adminSchema.login ),
    adminController.login
)

export default router;
