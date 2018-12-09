// @flow

import type { Peer } from './types'

import * as R from 'ramda'
import signale from 'signale'
import controlEnvironment from './controller'
import handleDevices from './actors'
import createPeer from './peer'
import createEnvInStateStream from './sensors'
import { setupCleanPeerDisconnectHandler } from './lib/util'

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
