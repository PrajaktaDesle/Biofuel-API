import express from 'express';

import fdController from '../../Controllers/Fd.controller';
import fdSchema from "../../Constants/Schema/Fd.schema"

const router = express.Router();
import { celebrate } from 'celebrate';
// import TransConfig from "../../Constants/Schema/TransConfig.schema.ts";

router.post(
    '/insert',
    celebrate(fdSchema.createFD),
    fdController.createFd
);

router.get(
    '/find',
    celebrate(fdSchema.fetchFD),
    fdController.fetchFd
);


export default router;