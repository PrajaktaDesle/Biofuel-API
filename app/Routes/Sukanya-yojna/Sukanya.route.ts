import express from 'express';

import sukanyaYojnaController from "../../Controllers/SukanyaYojna.controller";
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    // celebrate(SukanyaSchema.createSukanya),
    sukanyaYojnaController.createSukanyaYojna
);

router.get(
    '/',
    // celebrate(SukanyaSchema.fetchSukanyaSchemeById),
    sukanyaYojnaController.fetchSukanyaByCustomerId
);

// router.get(
//     '/details',
//     // celebrate(SukanyaSchema.fetchSukanyaDetails),
//     sukanyaYojnaController.fetchSukanyaDetails
// );

export default router;