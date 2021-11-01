import { Router } from 'express';

import asyncHandler from '../utils/wrap';
import auth from '../middlewares/auth';

import settings from '../../../settings';

const router = Router();

router.get('/', auth('admin'), asyncHandler(async () => settings))

export default router;