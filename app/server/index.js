import IO from 'socket.io';

const io = IO(8080);

function emitFermenterState(s) {
  io.emit('tempHumidity', s);
}

function init(stream) {
  io.on('connection', (socket) => {
    socket.on('tempHumidity', (request) => {
      console.log(`~~ I received a tempHumidity-request from ${request.from}:`);
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
