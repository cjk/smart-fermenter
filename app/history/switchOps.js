import {List, Seq} from 'immutable';
import {SwitchOp} from '../initialState';

const histSwOpsPath = ['history', 'switchOps'];

const createSwitchOps = (devices) =>
  devices.filter(dev => dev.willSwitch)
         .reduce((ops, dev, name) =>
           ops.push(
             new SwitchOp({device: name, to: dev.shouldSwitchTo, at: Date.now()})), new List()
         );

const switchOps = (prev, curr) => {
  const ops = createSwitchOps(curr.get('devices'));
  const history = new Seq(prev.getIn(histSwOpsPath)).concat(ops.toSeq());

  return curr.setIn(histSwOpsPath, history);
};

const addSwitchOp = (state, o) => {
  const history = state.getIn(histSwOpsPath),
        op = new SwitchOp(o);

  return state.setIn(histSwOpsPath, history.concat(op));
};

export {addSwitchOp};

export default switchOps;
