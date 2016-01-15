import IO from 'socket.io';

const io = IO(8080);

function init(stream) {
  io.on('connection', (socket) => {
    socket.on('tempHumidity', (request) => {
      console.log(`I received a tempHumidity-request from ${request.from}:`);
      stream.onValue((v) => io.emit('tempHumidity', v));
    });

    socket.on('disconnect', () => {
      io.emit('peer disconnected');
      console.log('peer disconnected from our state-feed');
      stream.offValue(() => {});
    });
  });
}

export default init;
