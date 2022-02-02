import express from 'express';

import lakhpatiSchemeController from "../../Controllers/LakhpatiYojna.controller";
import LakhpatiSchemeSchema from "../../Constants/Schema/LakhpatiYojna.schema";
const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(LakhpatiSchemeSchema.createLakhpatiYojna),
    lakhpatiSchemeController.createLakhpatiScheme
);

router.get(
    '/',
    celebrate(LakhpatiSchemeSchema.fetchByCustomerId),
    lakhpatiSchemeController.fetchByCustomerId
);

// router.get(
//     '/details',
//     // celebrate(LakhpatiSchemeSchema.fetchLakhpatiDetails),
//     lakhpatiSchemeController.fetchLakhpatiDetails
// );

export default router;