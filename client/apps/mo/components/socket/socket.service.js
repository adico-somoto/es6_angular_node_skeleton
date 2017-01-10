'use strict';

import * as _ from 'lodash';
import angular from 'angular';
import io from 'socket.io-client';

function Socket(socketFactory) {
  'ngInject';

  // socket.io now auto-configures its connection when we ommit a connection url

  const ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client',
  });

  const socket = socketFactory({ ioSocket });

  return {
    socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates(modelName, array, pCb) {
      const cb = pCb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(`${modelName}:save`, (item) => {
        const oldItem = _.find(array, {
          _id: item._id, // eslint-disable-line no-underscore-dangle
        });
        const index = array.indexOf(oldItem);
        let event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(`${modelName}:remove`, (item) => {
        const event = 'deleted';
        _.remove(array, {
          _id: item._id, // eslint-disable-line no-underscore-dangle
        });
        cb(event, item, array);
      });
    },

    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates(modelName) {
      socket.removeAllListeners(`${modelName}:save`);
      socket.removeAllListeners(`${modelName}:remove`);
    },
  };
}

export default angular.module('workApp.socket', [])
  .factory('socket', Socket)
  .name;
