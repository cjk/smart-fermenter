import {Emergency} from '../initialState';
import {Record} from 'immutable';

const maxEmergancyEntries = 100;
const histEmergencyPath = ['history', 'emergencies'];

const carryoverEmergencies = (prev, curr) => {
  /* Retrieve previous and current emergencies from history-state */
  const [prevEms, currEms] = [prev.getIn(histEmergencyPath), curr.getIn(histEmergencyPath)];

  return curr.setIn(histEmergencyPath, prevEms.concat(currEms));
};

const addEmergency = (state, e) => {
  const history = state.getIn(histEmergencyPath);
  const emergency = new Record({[e.at]: new Emergency(e)})();

  /* Save a limited number of emergencies in our history-state */
  return state.setIn(histEmergencyPath,
                     history.concat(emergency).takeLast(maxEmergancyEntries));
};

export {addEmergency, carryoverEmergencies};
