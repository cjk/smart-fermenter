import {Record} from 'immutable';

const InitialState = Record({
  createdAt: null,
  temperature: null,
  humidity: null,
  isValid: null,
  errors: 0,
  heaterIsRunning: false,
  humidifierIsRunning: false
});

export default InitialState;
