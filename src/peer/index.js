// @flow

import type { Peer } from '../types.js'
import type { Observable } from 'kefir'

import * as R from 'ramda'
import Gun from 'gun'
import signale from 'signale'
import config from './config.js'
import mergeRemoteUpdates from './mergeRemoteUpdates.js'

const onlyDistributedKeys = R.pick(['env', 'rts', 'devices'])

// const peerAddr = process.env.PEER_ADDR
// const peerPort = process.env.PEER_PORT
const peer = Gun(`http://${config.host}:${config.port}/gun`)

function createPeer(): Peer {
  return {
    subscription: null,
    mergeRemoteUpdates(state$: Observable<Object>) {
      return mergeRemoteUpdates(peer.get('fermenter'), state$)
    },
    start(state$: Observable<Object>) {
      const fermenterNode = peer.get('fermenter')
      // On each start, reset notifications or they'll grow without bounds!
      fermenterNode
        .get('rts')
        .get('notifications')
        .put(null)

      // DEBUGGING ONLY: what keys are in our (remote) fermenter-state?
      // fermenterNode
      //   .once()
      //   .map()
      //   .once((v, k) => console.log(k))

      this.subscription = state$
        .scan((prev, next) => {
          // Narrow scope to state-keys we want to share / transmit
          const minimumState = onlyDistributedKeys(next)
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
            R.map(key => fermenterRoot.get(key).put(R.prop(key, newState)), R.keys(onlyDistributedKeys(newState)))
          },
          error(err) {
            signale.error(`[fermenterPeer] An error occured: ${err}`)
          },
          end() {
            signale.info('[fermenterPeer] Fermenter-peer connection ended.')
          },
        })
    },
    stop() {
      this.subscription.unsubscribe()
    },
  }
}

export default createPeer
