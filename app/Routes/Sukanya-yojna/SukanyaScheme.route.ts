import express from 'express';

import sukanyaSchemeController from "../../Controllers/SukanyaScheme.controller";
import SukanyaSchema from "../../Constants/Schema/SukanyaScheme.schema"
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(SukanyaSchema.createSukanyaScheme),
    sukanyaSchemeController.createSukanyaScheme
);

router.get(
    '/',
    celebrate(SukanyaSchema.fetchByCustomerId),
    sukanyaSchemeController.fetchByCustomerId
);

// router.get(
//     '/details',
//     // celebrate(SukanyaSchema.fetchSukanyaDetails),
//     sukanyaSchemeController.fetchSukanyaDetails
// );

export default router;