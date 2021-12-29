import express from 'express';

import fdController from '../../Controllers/Fd.controller';
import fdSchema from '../../Constants/Schema/Fd.schema';

const router = express.Router();
import { celebrate } from 'celebrate';

router.post(
    '/',
    celebrate(fdSchema.insert_fd),
    fdController.create_FD
);

router.get(
    '/',
    celebrate(fdSchema.fetch_fd),
    fdController.fetch_FD
);


export default router;