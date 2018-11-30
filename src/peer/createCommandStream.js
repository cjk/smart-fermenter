// @flow

/* eslint no-console: "off" */
import type { Observable } from 'kefir'

import K from 'kefir'
import * as R from 'ramda'

const fermenterInitialCmd = {
  currentCmd: 'none',
  tempLimits: { lower: 29, upper: 31 },
  humidityLimits: { lower: 62, upper: 68 },
}

function handleCommands(peer: any): Observable<Object> {
  const remoteCommands = peer.get('fermenter').get('commands')

  const stream = K.stream(emitter => {
    remoteCommands
      .once()
      .map()
      .on((cmdVal, cmdKey) => {
        /* DEBUGGING */
        console.log(
          `[Fermenter-Cmd-Stream] Emitting fermenter <${cmdKey}> command we just received: <${JSON.stringify(cmdVal)}>`
        )
        const limitValues$ = R.map(
          limit => K.fromCallback(cb => remoteCommands.get(limit).on((v, k) => cb({ v, k }))),
          ['humidityLimits', 'tempLimits']
        )
        K.zip(limitValues$).onValue(limits =>
          emitter.emit(
            R.reduce((acc, limit) => R.assoc(limit.k, R.dissoc('_', limit.v), acc), { currentCmd: 'none' }, limits)
          )
        )
      })
  })
  remoteCommands.put(fermenterInitialCmd)

  return stream
}

export default handleCommands
