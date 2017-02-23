'use strict';

import express from 'express';
import config from '../config/environment';
import User from '../api/user/user.model';
// Passport Configuration
import localPassportSetup from './local/passport';
import facebookPassportSetup from './facebook/passport';
import googlePassportSetup from './google/passport';
import twiterPassportSetup from './twitter/passport';
// Routing
import localRouter from './local';
import facebookRouter from './facebook';
import twiterRouter from './twitter';
import googleRouter from './google';

localPassportSetup(User, config);
facebookPassportSetup(User, config);
googlePassportSetup(User, config);
twiterPassportSetup(User, config);

const router = express.Router();

router.use('/local', localRouter);
router.use('/facebook', facebookRouter);
router.use('/twitter', twiterRouter);
router.use('/google', googleRouter);

export default router;
