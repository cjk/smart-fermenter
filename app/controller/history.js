import {List} from 'immutable';
import {SwitchOp} from '../initialState';

const histSwOpsPath = ['history', 'switchOps'];

const createSwitchOps = (devices) => {
  return devices.filter(dev => dev.willSwitch)
                .reduce((ops, dev, name) => ops.push(SwitchOp({device: name, to: dev.shouldSwitchTo, at: Date.now()})), List());
};

const historyController = (state) => {
  const ops = createSwitchOps(state.get('devices'));
  console.log('~~~~~~~~~~~~~~~~~~~', ops);
  const history = state.getIn(histSwOpsPath);

  return ops.toSeq();
  //return history ?
  //state.getIn(histSwOpsPath).push(ops) :
  //state.setIn(histSwOpsPath, ops);
};

export default historyController;
