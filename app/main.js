import controlEnvironment from './controller';
import handleDevices from './actors';
import handleWatchdogs from './watchdogs';
import moment from 'moment';
import server from './server';
import envStream from './sensors';

const fermenterEnvStream = controlEnvironment(envStream);

handleDevices(handleWatchdogs(fermenterEnvStream));

server(fermenterEnvStream.throttle(8000, {trailing: false}));

/* DEBUGGING */
fermenterEnvStream
  .map(state =>
    state.updateIn(['env', 'createdAt'], (v) => moment(v).format())
      //.toJS()
  )
  .log();

console.log('----------------------------------------------------------------------');
