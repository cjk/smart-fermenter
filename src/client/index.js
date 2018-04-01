// @flow

import K from 'kefir';
import config from './config';
import createCommandStream from './createCommandStream';
import deepstream from 'deepstream.io-client-js';

import logger from 'debug';

const info = logger('smt:fermenter:client'),
  error = logger('smt:fermenter:client');

const login$ = K.fromPromise(
  new Promise((resolve, reject) => {
    const client = deepstream(`${config.host}:${config.port}`).login(
      { username: config.namespace },
      success => {
        if (success) {
          info(`Connected to backend <${config.host}>`);
          resolve(client);
        } else {
          /* login or connection failed - see
             https:deepstream.io/docs/client-js/client/ how to handle this situation more
             gracefully than now. */
          info(`FAILED to connect to backend <${config.host}>`);
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
        err(err) {
          error('Error connecting to deepstream-server!');
          error(err);
        },
      });
      return this;
    },
    mergeCommandStream(state$) {
      return login$.flatMap(dsClient => {
        const cmd$ = createCommandStream(dsClient);
        return state$.combine(cmd$, (state, cmd) => {
          /* Merge fermenter-command / temperature-limits into state structure, under run-time-status, currentCmd: */
          const newRts = state.get('rts').merge(cmd);
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
          error(`[fermenterClient] An error occured: ${error}`);
        },
        end() {
          info('[fermenterClient] Fermenter-client connection ended.');
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
