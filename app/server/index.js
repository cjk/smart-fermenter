import IO from 'socket.io';

const io = IO(8080);

function init(stream) {
  io.on('connection', function (socket) {
    socket.on('tempHumidity', (request) => {
      console.log(`I received a tempHumidity-request from ${request.from}:`);
      stream.onValue((v) => io.emit('tempHumidity', v));
    });

    socket.on('disconnect', function () {
      io.emit('peer disconnected');
      stream.offValue(() => {})
    });
  });
}

export default init;
