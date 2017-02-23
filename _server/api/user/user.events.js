/**
 * User model events
 */

'use strict';

import { EventEmitter } from 'events';
import User from './user.model';

const UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove',
};

function emitEvent(event) {
  return (doc) => {
    UserEvents.emit(`${event}:${doc._id}`, doc); // eslint-disable-line no-underscore-dangle
    UserEvents.emit(event, doc);
  };
}

// Register the event emitter to the model events
Object.keys(events).forEach((key) => {
  User.schema.post(key, emitEvent(events[key]));
});

export default UserEvents;
