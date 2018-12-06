// @flow

import type { Observable } from 'kefir'
import type { FermenterState } from '../types'

import K from 'kefir'
import * as R from 'ramda'

type CmdEvent = {
  path: Array<string>,
  value: string,
}

const createRemoteCmd$: any => Observable<Object> = fermenterRootNode =>
  K.stream(emitter => {
    fermenterRootNode
      .get('rts')
      .get('currentCmd')
      .on(cmd => emitter.emit({ path: ['rts', 'currentCmd'], value: cmd || 'none' }))

    return () => {
      fermenterRootNode
        .get('rts')
        .get('currentCmd')
        .off()
    }
  }).toProperty(() => ({ path: ['rts', 'currentCmd'], value: 'none' }))

function mergeRemoteUpdates(fermenterRootNode: any, state$: Observable<Object>): Observable<Object> {
  return K.combine([state$, createRemoteCmd$(fermenterRootNode)], (fermState: FermenterState, cmdEvent: CmdEvent) =>
    R.assocPath(cmdEvent.path, cmdEvent.value, fermState)
  )
}

export default mergeRemoteUpdates
