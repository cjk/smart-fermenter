/* eslint no-console: "off" */
import io from 'socket.io-client';
import R from 'ramda';
import handleRemoteCommands from './handleCommands';

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

function startClient(stateStream) {
  const stopStreaming = R.curry(_stopStreaming);

  socket
  .on('connect_error', () =>
    console.log(`ERROR connecting to smart-home-backend on <${config.host}:${config.port}>`))
  .on('connect_timeout', () =>
    console.log(`TIMEOUT connecting to smart-home-backend on <${config.host}:${config.port}>!`))
  .on('connect', () => {
    console.log(`Connected to smart-home-backend on <${config.host}:${config.port}>`);
    startStreaming(stateStream);
    handleRemoteCommands(socket);
  })
  .on('disconnect', stopStreaming(stateStream));
}

export default startClient;
