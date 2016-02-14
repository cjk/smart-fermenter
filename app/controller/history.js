import {List, Seq} from 'immutable';
import {SwitchOp} from '../initialState';

const histSwOpsPath = ['history', 'switchOps'];

const createSwitchOps = (devices) => {
  return devices.filter(dev => dev.willSwitch)
                .reduce((ops, dev, name) => ops.push(new SwitchOp({device: name, to: dev.shouldSwitchTo, at: Date.now()})), List());
};

const historyController = (prev, curr) => {
  const ops = createSwitchOps(curr.get('devices'));
  const history = Seq(prev.getIn(histSwOpsPath)).concat(ops.toSeq());

  return curr.setIn(histSwOpsPath, history);
};

export default historyController;
