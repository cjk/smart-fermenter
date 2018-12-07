// @flow

import type { Observable } from 'kefir'
import type { FermenterState } from '../types'

import K from 'kefir'
import * as R from 'ramda'

type RemoteCmdEvent = {
  path: Array<string>,
  value: string,
}
type RemoteTempLimitsEvent = {
  path: Array<string>,
  value: {
    lower: number,
    upper: number,
  },
}

const createRemoteCmd$: any => Observable<Object> = fermenterRootNode =>
  K.stream(emitter => {
    fermenterRootNode
      .get('rts')
      .get('currentCmd')
      .on(value => emitter.emit({ path: ['rts', 'currentCmd'], value: value || 'none' }))

    return () => {
      fermenterRootNode
        .get('rts')
        .get('currentCmd')
        .off()
    }
  })

const createRemoteTempLimits$: any => Observable<Object> = fermenterRootNode =>
  K.stream(emitter => {
    fermenterRootNode
      .get('rts')
      .get('tempLimits')
      .on(value =>
        emitter.emit({ path: ['rts', 'tempLimits'], value: R.dissoc('_', value) || { lower: 29, upper: 31 } })
      )

    return () => {
      fermenterRootNode
        .get('rts')
        .get('tempLimits')
        .off()
    }
  })

function mergeRemoteUpdates(fermenterRootNode: any, state$: Observable<Object>): Observable<Object> {
  const remoteCmd$ = createRemoteCmd$(fermenterRootNode).skipDuplicates((a, b) => R.equals(a, b))
  const remoteTempLimits$ = createRemoteTempLimits$(fermenterRootNode).skipDuplicates((a, b) => R.equals(a, b))

  return K.combine(
    [state$, remoteCmd$, remoteTempLimits$],
    (fermState: FermenterState, cmdEvent: RemoteCmdEvent, tempLimitsEvent: RemoteTempLimitsEvent) =>
      // Though almost impossible that command + templimits were both updated at the same time, for simplicity-reasons
      // we change state for both here for now:
      R.pipe(
        R.assocPath(cmdEvent.path, cmdEvent.value),
        R.assocPath(tempLimitsEvent.path, tempLimitsEvent.value)
      )(fermState)
  )
}

export default mergeRemoteUpdates
