import controlEnvironment from './controller';
import handleDevices from './actors';
import server from './server';
import envStream from './sensors';

const fermenterEnvStream = controlEnvironment(envStream);
handleDevices(fermenterEnvStream);

//server(fermenterEnvStream.throttle(8000, {trailing: false}));

//envStream
//.onError(error => {
//console.warn('Env-stream error: ', error);
//})
//.log(); //console.log(env.set('createdAt', moment.format(env.get('createdAt'))).toJS())

fermenterEnvStream
                           .map(state => state.toJS())
                           .log();
