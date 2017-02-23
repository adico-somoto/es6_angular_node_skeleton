/**
 * Thing model events
 */

'use strict';

import { EventEmitter } from 'events';
import Thing from './thing.model';

const ThingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ThingEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove',
};

function emitEvent(event) {
  return (doc) => {
    ThingEvents.emit(`${event}:${doc._id}`, doc); // eslint-disable-line no-underscore-dangle
    ThingEvents.emit(event, doc);
  };
}

// Register the event emitter to the model events
Object.keys(events).forEach((key) => {
  Thing.schema.post(key, emitEvent(events[key]));
});

export default ThingEvents;
