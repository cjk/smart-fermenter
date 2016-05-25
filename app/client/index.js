/* eslint no-console: "off" */
import config from './config';
import createCommandStream from './createCommandStream';
import io from 'socket.io-client';

const socket = io.connect(`http://${config.host}:${config.port}/${config.namespace}`);

const emitFermenterState = (state) =>
  socket.emit('fermenterState', state.toJS());

function startStreaming(stream) {
  console.log(`Connected to smart-home-backend on <${config.host}:${config.port}> - starting streaming...`);
  stream.onValue(emitFermenterState);
}

function stopStreaming(stream) {
  console.log('Disconnected from smart-home-backend - stopping streaming...');
  stream.offValue(emitFermenterState);
}

function createClient(stateStream) {
  const cmdStream = createCommandStream(socket);

  /* DEBUGGING */
  // cmdStream.onValue((v) => {
  // console.log(`[Command-Stream] Got value: ${JSON.stringify(v)}`);
  // });

  const runtimeStream = stateStream.combine(cmdStream, (state, cmd) => {
    /* Merge fermenter-command into state structure, under run-time-status, currentCmd: */
    const newRts = state.get('rts').set('currentCmd', cmd.fermenterCmd);
    return state.set('rts', newRts);
  });

  function start(stream) {
    socket.on('connect', () => {
      socket.on('disconnect', stopStreaming(stream));

      /* TODO: Should we throttle our outgoing stream to save network bandwidth,
         like so: statestream.throttle(5000, {trailing: false}) */
      startStreaming(stream);
    });
  }

  socket
    .on('connect_error', () =>
      console.log(`ERROR connecting to smart-home-backend on <${config.host}:${config.port}>`))
    .on('connect_timeout', () =>
      console.log(`TIMEOUT connecting to smart-home-backend on <${config.host}:${config.port}>!`));

  return {runtimeStream, start};
}

export default createClient;
