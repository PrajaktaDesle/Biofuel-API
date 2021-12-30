import express from 'express';

import rdController from '../../Controllers/Rd.contoller';
import rdSchema from '../../Constants/Schema/Rd.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(rdSchema.createRD),
    rdController.createRd
);

router.get(
    '/',
    celebrate(rdSchema.fetchRd),
    rdController.fetchRd
);


export default router;