/* eslint no-console: "off" */
import K from 'kefir';
import config from './config';
import createCommandStream from './createCommandStream';
import deepstream from 'deepstream.io-client-js';

const login$ = K.fromPromise(
  new Promise((resolve, reject) => {
    const client = deepstream(`${config.host}:${config.port}`).login(
      { username: config.namespace },
      success => {
        if (success) {
          resolve(client);
        } else {
          /* login or connection failed - see
             https:deepstream.io/docs/client-js/client/ how to handle this situation more
             gracefully than now. */
          reject();
        }
      }
    );
  })
);

const putFermenterState = newState =>
  login$.onValue(client => {
    client.record.getRecord('fermenter/state').whenReady(rs => {
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
    mergeCommandStream(state$) {
      return login$.flatMap(dsClient => {
        const cmd$ = createCommandStream(dsClient);
        return state$.combine(cmd$, (state, cmds) => {
          /* Merge fermenter-command into state structure, under run-time-status, currentCmd: */
          const newRts = state.get('rts').merge(cmds);
          return state.set('rts', newRts);
        });
      });
    },
    start(runtime$) {
      this.subscription = runtime$.observe({
        value(newState) {
          putFermenterState(newState);
        },
        error(error) {
          console.error(`[fermenterClient] An error occured: ${error}`);
        },
        end() {
          console.log('[fermenterClient] Fermenter-client connection ended.');
        },
      });
    },
    stop() {
      this.subscription.unsubscribe();
    },
  };

  return Object.create(client).init();
}

export default createClient;
