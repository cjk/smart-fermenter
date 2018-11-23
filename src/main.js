/* eslint no-console: "off" */

import { pipe } from 'ramda'
import controlEnvironment from './controller'
import handleDevices from './actors'
// import createPeer from './client'
import createEnvInStateStream from './sensors'
import { setupCleanClientDisconnectHandler } from './lib/util'

const state$ = createEnvInStateStream()

// TODO:
// const peer = createPeer()

// Cleanup peer-connection on restarts or interrupts
// setupCleanClientDisconnectHandler(peer)

// DEBUGGING only
// state$.log()

const workflow = pipe(
  // peer.mergeCommandStream,
  controlEnvironment,
  handleDevices
  // peer.start
)

console.log('----------------------------------------------------------------------')

workflow(state$)

// Send startup-completed signal to process-manager
if (process.send) process.send('ready')
