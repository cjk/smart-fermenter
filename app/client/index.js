/* eslint no-console: "off" */
import io from 'socket.io-client';
import R from 'ramda';
import createCommandStream from './createCommandStream';

const config = {
  host: 'localhost', /* NOTE: zircon.local is not available on HOME-LAN! :( */
  //host: '192.168.0.28', /* NOTE: zircon.local is not available on HOME-LAN! :( */
  port: 4001,
  namespace: 'fermenter'
};

const socket = io.connect(`http://${config.host}:${config.port}/${config.namespace}`);

const emitFermenterState = (state) =>
  socket.emit('fermenterState', state.toJS());

function startStreaming(stateStream) {
  console.log('Starting streaming to smart-home-backend.');
  stateStream.onValue(emitFermenterState);
}

function _stopStreaming(stateStream, socket) {
  console.log('Disconnected from smart-home-backend - stopping streaming...');
  stateStream.offValue(emitFermenterState);
}

function createClient(stateStream) {
  const stopStreaming = R.curry(_stopStreaming);

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

  socket
    .on('connect_error', () =>
      console.log(`ERROR connecting to smart-home-backend on <${config.host}:${config.port}>`))
    .on('connect_timeout', () =>
      console.log(`TIMEOUT connecting to smart-home-backend on <${config.host}:${config.port}>!`))
    .on('connect', () => {
      console.log(`Connected to smart-home-backend on <${config.host}:${config.port}> - starting streaming...`);
      /* TODO: Should we throttle our outgoing stream to save network bandwidth,
         like so: statestream.throttle(5000, {trailing: false}) */
      startStreaming(runtimeStream);
    })
    .on('disconnect', stopStreaming(runtimeStream));

  return runtimeStream;
}

export default createClient;
