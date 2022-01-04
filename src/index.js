// @flow

import type { Peer } from './types.js'

import * as R from 'ramda'
import signale from 'signale'
import controlEnvironment from './controller/index.js'
import handleDevices from './actors/index.js'
import createPeer from './peer/index.js'
import createEnvInStateStream from './sensors/index.js'
import { setupCleanPeerDisconnectHandler } from './lib/util.js'

// Perform possible cleanup on restarts or interrupts
setupCleanPeerDisconnectHandler()

const state$ = createEnvInStateStream()

const peer: Peer = createPeer()

// for DEBUGGING - take care to place #spy in the right order to view state at the time you intend to!
// state$.spy()

const workflow = R.pipe(
  peer.mergeRemoteUpdates,
  controlEnvironment,
  handleDevices,
  peer.start
)

signale.start('Starting up fermenter-loop...')

workflow(state$)

// Send startup-completed signal to process-manager
if (process.send) process.send('ready')
