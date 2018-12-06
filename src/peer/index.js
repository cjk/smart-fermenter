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
      const fermenterNode = peer.get('fermenter')
      // On each start, reset notifications or they'll grow without bounds!
      fermenterNode
        .get('rts')
        .get('notifications')
        .put(null)

      this.subscription = state$
        .scan((prev, next) => {
          // Narrow scope to state-keys we want to share / transmit
          const minimumState = R.pick(['env', 'rts', 'devices'], next)
          // Remove keys from fermenter-state that haven't changed since last time to avoid unneeded network-traffic
          return R.reduce(
            (acc, key) => (R.equals(prev[key], minimumState[key]) ? R.dissoc(key, acc) : acc),
            minimumState,
            R.keys(minimumState)
          )
        })
        .observe({
          value(newState) {
            const fermenterRoot = peer.get('fermenter')
            R.map(key => fermenterRoot.get(key).put(R.prop(key, newState)), R.keys(newState))
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
