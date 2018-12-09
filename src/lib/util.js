// @flow

import signale from 'signale'

// Allow for clean restarts (e.g. when using pm2 or other process managers)
function setupCleanPeerDisconnectHandler() {
  return process.on('SIGINT', () => {
    signale.pause('Received SIGINT. Cleaning up and exiting...')
    process.exit()
  })
}

export { setupCleanPeerDisconnectHandler }
