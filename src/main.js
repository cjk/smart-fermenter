// @flow
/* eslint no-console: "off" */

import type { Peer } from './types'

import { pipe } from 'ramda'
import controlEnvironment from './controller'
import handleDevices from './actors'
import createPeer from './peer'
import createEnvInStateStream from './sensors'
import { setupCleanPeerDisconnectHandler } from './lib/util'

const state$ = createEnvInStateStream()

const peer: Peer = createPeer()

// TODO:
// Cleanup peer-connection on restarts or interrupts
// setupCleanPeerDisconnectHandler(peer)

// for DEBUGGING - take care to place #spy in the right order to view state at the time you intend to!
// state$.spy()

const workflow = pipe(
  peer.mergeRemoteUpdates,
  controlEnvironment,
  handleDevices,
  peer.start
)

console.log('----------------------------------------------------------------------')

workflow(state$)

// Send startup-completed signal to process-manager
if (process.send) process.send('ready')
