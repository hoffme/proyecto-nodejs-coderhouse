import { Router } from 'express';

import asyncHandler from '../utils/wrap';
import auth from '../middlewares/auth';

import settings from '../../../settings';

const router = Router();

router.get('/settings', auth('admin'), asyncHandler(async () => settings))

export default router;