import express from 'express';

import PensionSchemeController from "../../Controllers/PensionScheme.controller";
import PensionSchemeSchema from "../../Constants/Schema/PensionScheme.schema";
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(PensionSchemeSchema.createPensionScheme),
    PensionSchemeController.createPensionScheme
);

router.get(
    '/',
    celebrate(PensionSchemeSchema.fetchByCustomerId),
    PensionSchemeController.fetchByCustomerId
);

// router.get(
//     '/details',
//     // celebrate(PensionSchemeSchema.fetchPensionDetails),
//     PensionSchemeController.fetchPensionDetails
// );

export default router;