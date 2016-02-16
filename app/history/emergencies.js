import {List, Seq} from 'immutable';
import {Emergency} from '../initialState';

const histEmergencyPath = ['history', 'emergencies'];

const emergencies = (prev, curr) => {
  const history = prev.getIn(histEmergencyPath) || Seq();

  if (!prev.getIn(['env', 'emergency']))
    return curr.setIn(histEmergencyPath, history);

  const e = new Emergency({device: 'unknown', at: Date.now()});

  return curr.setIn(histEmergencyPath, List(history).push(e));
};

export default emergencies;
