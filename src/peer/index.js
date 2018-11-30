// @flow
import type { Observable } from 'kefir'
import type { FermenterState } from '../types'

import * as R from 'ramda'
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

type RemoteCommand = { currentCmd: string }

const info = logger('smt:fermenter:peer')
const error = logger('smt:fermenter:peer')

const peer = Gun(`http://${config.host}:${config.port}/gun`)

function createPeer(): Peer {
  return {
    peer,
    subscription: null,
    mergeCommandStream(state$: Observable<Object>) {
      const cmd$ = createCommandStream(peer)
      return state$.combine(cmd$, (state: FermenterState, cmd: RemoteCommand) => {
        // Merge fermenter-command / temperature-limits into state structure, under run-time-status, currentCmd:
        return R.assoc('rts', R.merge(state.rts, cmd), state)
      })
    },
    start(state$: Observable<Object>) {
      this.subscription = state$.observe({
        value(newState) {
          const { env, rts } = newState
          // info(`pushing new runtime state: ${JSON.stringify(rts)}`)
          peer
            .get('fermenter')
            .get('rts')
            .put(rts)
            .back()
            .get('env')
            .put(env)
        },
        error(err) {
          error(`[fermenterPeer] An error occured: ${err}`)
        },
        end() {
          info('[fermenterPeer] Fermenter-peer connection ended.')
        },
      })
    },
    stop() {
      this.subscription.unsubscribe()
    },
  }
}

export default createPeer
