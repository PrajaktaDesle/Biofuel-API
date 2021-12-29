import express from 'express';

import transConfigController from '../../Controllers/TransConfig.controller';
import transConfigSchema from "../../Constants/Schema/TransConfig.schema"

const router = express.Router();
import { celebrate } from 'celebrate';
// import TransConfig from "../../Constants/Schema/TransConfig.schema.ts";

router.post(
    '/insert',
    celebrate(transConfigSchema.createTransConfig),
    transConfigController.createTransConfig
);

router.get(
    '/type',
    celebrate(transConfigSchema.fetchTransConfig),
    transConfigController.fetchTransConfig
);


export default router;