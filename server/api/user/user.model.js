'use strict';

/* eslint no-invalid-this:0*/
import crypto from 'crypto';
import mongoose, { Schema } from 'mongoose';

mongoose.Promise = require('bluebird');

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      }

      return false;
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      }

      return false;
    },
  },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(() => ({ name: this.name, role: this.role }));

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(() => ({ _id: this._id, role: this.role })); // eslint-disable-line no-underscore-dangle

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate((email) => {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate((password) => {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate((value, respond) => {
    if (authTypes.indexOf(this.provider) !== -1) {
      return respond(true);
    }

    return this.constructor.findOne({ email: value }).exec()
      .then((user) => {
        if (user) {
          if (this.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch((err) => {
        throw err;
      });
  }, 'The specified email address is already in use.');

const validatePresenceOf = value => value && value.length;

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', (next) => {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      if (authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      }

      return next();
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
      return true;
    });

    return true;
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      }

      return callback(null, false);
    });

    return true;
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(pByteSize, pCallback) {
    let callback = pCallback;
    let byteSize = pByteSize;

    const defaultByteSize = 16;

    if (typeof byteSize === 'function') {
      callback = byteSize;
      byteSize = defaultByteSize;
    } else if (typeof callback !== 'function') {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      }

      return callback(null, salt.toString('base64'));
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      }

      return callback('Missing password or salt');
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        return callback(err);
      }

      return callback(null, key.toString('base64'));
    });
  },
};

export default mongoose.model('User', UserSchema);
