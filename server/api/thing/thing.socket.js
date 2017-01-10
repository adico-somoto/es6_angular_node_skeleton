/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import ThingEvents from './thing.events';

// Model events to emit
const events = ['save', 'remove'];

function createListener(event, socket) {
  return (doc) => {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return () => {
    ThingEvents.removeListener(event, listener);
  };
}

export default function register(socket) {
  // Bind model events to socket events
  for (let i = 0, eventsLength = events.length; i < eventsLength; i += 1) {
    const event = events[i];
    const listener = createListener(`thing:${event}`, socket);

    ThingEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}
