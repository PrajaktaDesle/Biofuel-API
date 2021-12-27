import express from 'express';

import rdController from '../../Controllers/Rd.contoller';
import rdSchema from '../../Constants/Schema/Rd.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(rdSchema.rd),
    rdController.create_RD
);

router.get(
    '/',
    celebrate(rdSchema.fetch),
    rdController.fetch_RD
);


export default router;