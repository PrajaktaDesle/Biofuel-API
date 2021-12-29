import express from 'express';
import fdController from '../../Controllers/Fd.controller';
import fdSchema from "../../Constants/Schema/Fd.schema"
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(fdSchema.createFD),
    fdController.createFd
);

router.get(
    '/',
    celebrate(fdSchema.fetchFdByCustomer),
    fdController.fetchFdByCustomer
);

export default router;