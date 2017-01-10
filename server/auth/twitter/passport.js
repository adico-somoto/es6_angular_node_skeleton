'use strict';

/* eslint-disable no-underscore-dangle */

import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

export default function setup(User, config) {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
  },
  (token, tokenSecret, pProfile, done) => {
    const profile = pProfile;
    profile._json.id = `${profile._json.id}`;
    profile.id = `${profile.id}`;

    User.findOne({ 'twitter.id': profile.id }).exec()
      .then((user) => {
        if (user) {
          return done(null, user);
        }

        const newUser = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'twitter',
          twitter: profile._json,
        });
        newUser.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));

        return true;
      })
      .catch(err => done(err));
  }));
}
