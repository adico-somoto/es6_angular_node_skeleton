'use strict';

import express from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

const router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false,
  }))
  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false,
  }), setTokenCookie);

export default router;
