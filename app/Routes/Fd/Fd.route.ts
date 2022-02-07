import express from 'express';
import fdController from '../../Controllers/Fd.controller';
import fdSchema from "../../Constants/Schema/Fd.schema"
const router = express.Router();
import { celebrate } from 'celebrate';
import rdSchema from "../../Constants/Schema/Rd.schema";
import rdController from "../../Controllers/Rd.contoller";

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

router.get(
    '/all',
    celebrate(fdSchema.fetchAllFdByTenant),
    fdController.fetchAllFdByTenant
);

export default router;