// TODO: history / switchOps needs refactoring!

import { switchOp } from '../initialState.js'

const maxSwitchOpsEntries = 1000

const histSwOpsPath = ['history', 'switchOps']

const createSwitchOps = devices =>
  devices
    .filter(dev => dev.willSwitch)
    .reduce(
      (ops, dev, name) => ops.push(new switchOp({ device: name, to: dev.shouldSwitchTo, at: Date.now() })),
      new List()
    )

const addSwitchOp = (state, o) => {
  const history = state.getIn(histSwOpsPath)
  const op = new switchOp(o)

  /* Save a limited number of switching operations to our history-state */
  return state.setIn(histSwOpsPath, history.concat(op).takeLast(maxSwitchOpsEntries))
}

function switchOps(prev, curr) {
  const ops = createSwitchOps(curr.get('devices'))
  const history = new Seq(prev.getIn(histSwOpsPath)).concat(ops.toSeq())

  return curr.setIn(histSwOpsPath, history)
}

export { addSwitchOp }

export default switchOps
