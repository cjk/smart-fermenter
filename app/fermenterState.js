import {Record} from 'immutable';

const InitialState = Record({
  createdAt: Date.now(),
  temperature: 0,
  humidity: 0,
  isValid: false,
  errors: 0
});

const initialState = new InitialState;

export default function fermenterStateReducer(state = initialState) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  return state;
}
