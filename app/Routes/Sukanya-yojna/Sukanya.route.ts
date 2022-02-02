import express from 'express';

import sukanyaYojnaController from "../../Controllers/SukanyaYojna.controller";
import SukanyaSchema from "../../Constants/Schema/SukanyaYojna.schema"
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(SukanyaSchema.createSukanyaYojna),
    sukanyaYojnaController.createSukanyaYojna
);

router.get(
    '/',
    celebrate(SukanyaSchema.fetchByCustomerId),
    sukanyaYojnaController.fetchByCustomerId
);

// router.get(
//     '/details',
//     // celebrate(SukanyaSchema.fetchSukanyaDetails),
//     sukanyaYojnaController.fetchSukanyaDetails
// );

export default router;