import IO from 'socket.io';

const io = IO(8080);

function emitFermenterState(s) {
  io.emit('fermenterState', s);
}

function init(stream) {
  io.on('connection', (socket) => {
    console.log('~~ Client connected via SocketIO.');

    socket.on('fermenterCommand', (cmd) => {
      console.log(`~~ Received a remote-command: <${cmd}>`);
      //stream.offValue(emitFermenterState);
    });

    /* Subscribe to state-requests from the backend */
    socket.on('fermenterState', (request) => {
      console.log(`~~ I received a fermenterState-request from ${request.from}:`);
      stream.onValue(emitFermenterState);
    });

    socket.on('disconnect', () => {
      io.emit('peer disconnected');
      console.log('~~ peer disconnected from our state-feed');
      stream.offValue(emitFermenterState);
    });
  });
}

export default init;
