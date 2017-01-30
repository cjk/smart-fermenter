/* eslint no-console: "off" */
import config from './config';
import createCommandStream from './createCommandStream';
import deepstream from 'deepstream.io-client-js';
import K from 'kefir';

const login$ = K.fromPromise(
  new Promise((resolve, reject) => {
    const client = deepstream(`${config.host}:${config.port}`).login({username: config.namespace}, (success) => {
      if (success) {
        resolve(client);
      } else {
        /* login or connection failed - see https:deepstream.io/docs/client-js/client/ how to handle this situation more
           gracefully than now. */
        reject();
      }
    });
  }));


const putFermenterState = newState =>
  login$.onValue((client) => {
    client.record.getRecord('fermenter/state').whenReady((rs) => {
      rs.set(newState.toJS());
    });
  });

function createClient() {
  const client = {
    dsClient: null,
    subscription: null,
    init() {
      login$.observe({
        value(dsClient) {
          this.dsClient = dsClient;
        },
        err(error) {
          console.error('Failed to connect to deepstream-server!');
          console.error(error);
        },
      });
      return this;
    },
    mergeCommandStream(stream$) {
      return login$.flatMap((dsClient) => {
        const cmdStream = createCommandStream(dsClient);
        return stream$.combine(cmdStream, (state, cmd) =>
          /* Merge fermenter-command into state structure, under run-time-status, currentCmd: */
          state.set(
            'rts',
            state.get('rts').set('currentCmd', cmd['fermenter/command']))
        );
      });
    },
    start(runtimeStream$) {
      this.subscription = runtimeStream$.observe({
        value(newState) {
          putFermenterState(newState);
        },
        error(error) {
          console.error(`[fermenterClient] An error occured: ${error}`);
        },
        end() {
          console.log('[fermenterClient] Fermenter-client connection ended.');
        }
      });
    },
    stop() {
      this.subscription.unsubscribe();
    }
  };

  return Object.create(client).init();
}

export default createClient;
