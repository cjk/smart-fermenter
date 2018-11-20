// @flow
import type { Observable } from 'kefir'

import config from './config'
import createCommandStream from './createCommandStream'
import Gun from 'gun'

import logger from 'debug'

type Peer = {
  peer: any,
  mergeCommandStream: (Observable<Object>) => Observable<Object>,
  start: (Observable<Object>) => void,
  stop: () => void,
}

const info = logger('smt:fermenter:client'),
  error = logger('smt:fermenter:client')

const peer = Gun(`http://${config.host}:${config.port}/gun`)

function createClient(): Peer {
  return {
    peer,
    subscription: null,
    mergeCommandStream(state$: Observable<Object>) {
      const cmd$ = createCommandStream(peer)
      return state$.combine(cmd$, (state, cmd) => {
        /* Merge fermenter-command / temperature-limits into state structure, under run-time-status, currentCmd: */
        const newRts = state.get('rts').merge(cmd)
        return state.set('rts', newRts)
      })
    },
    start(runtime$: Observable<Object>) {
      this.subscription = runtime$.observe({
        value(newState) {
          peer
            .get('fermenter')
            .get('state')
            .put(newState.toJS())
        },
        error(error) {
          error(`[fermenterClient] An error occured: ${error}`)
        },
        end() {
          info('[fermenterClient] Fermenter-client connection ended.')
        },
      })
    },
    stop() {
      this.subscription.unsubscribe()
    },
  }
}

export default createClient
