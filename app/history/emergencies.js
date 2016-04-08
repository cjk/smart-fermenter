import {Emergency} from '../initialState';
import {Record} from 'immutable';

const histEmergencyPath = ['history', 'emergencies'];

const carryoverEmergencies = (prev, curr) => {
  const [prevEms, currEms] = [prev.getIn(histEmergencyPath), curr.getIn(histEmergencyPath)];

  return curr.setIn(histEmergencyPath, prevEms.concat(currEms));
};

const addEmergency = (state, e) => {
  const history = state.getIn(histEmergencyPath);
  const emergency = new Record({[e.at]: new Emergency(e)})();

  return state.setIn(histEmergencyPath, history.concat(emergency));
};

export {addEmergency, carryoverEmergencies};
