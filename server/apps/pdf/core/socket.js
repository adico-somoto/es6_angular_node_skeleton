import SocketIO from 'socket.io';

let inited = false;
const clients = {};

function getUserSocket(socketid) {
  if (Object.prototype.hasOwnProperty.call(clients, socketid)) {
    return clients[socketid];
  }

  return null;
}

function init(server) {
  if (!inited) {
    const io = SocketIO(server, { origins: '*:*' });

    inited = true;
    io.sockets.on('connection', (socket) => {
      // TODO:
      // clients[socket.id] = require('../app/rt_progress')(socket);
    });
  }

  return { getUserSocket };
}

module.exports = { init };
