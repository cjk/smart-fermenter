// @flow

/* eslint no-console: "off" */
import type { Observable } from 'kefir'
import K from 'kefir'

const fermenterInitialCmd = { currentCmd: 'none', tempLimits: [] }

function handleCommands(peer: any): Observable<Object> {
  const remoteCommands = peer.get('fermenter').get('commands')

  const stream = K.stream(emitter => {
    remoteCommands.on((cmd, key) => {
      /* DEBUGGING */
      console.log(
        `[Fermenter-Cmd-Stream] Emitting fermenter <${key}> command we just received: <${JSON.stringify(cmd)}>`
      )
      emitter.emit(cmd)
    })
  })
  remoteCommands.put(fermenterInitialCmd)

  return stream.toProperty(() => fermenterInitialCmd)
}

export default handleCommands
