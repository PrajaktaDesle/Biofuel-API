import express from 'express';

import lakhpatiYojnaController from "../../Controllers/LakhpatiYojna.controller";
import LakhpatiYojnaSchema from "../../Constants/Schema/LakhpatiYojna.schema";
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(LakhpatiYojnaSchema.createLakhpatiYojna),
    lakhpatiYojnaController.createLakhpatiYojna
);

router.get(
    '/',
    celebrate(LakhpatiYojnaSchema.fetchByCustomerId),
    lakhpatiYojnaController.fetchByCustomerId
);

// router.get(
//     '/details',
//     // celebrate(SukanyaSchema.fetchSukanyaDetails),
//     sukanyaYojnaController.fetchSukanyaDetails
// );

export default router;