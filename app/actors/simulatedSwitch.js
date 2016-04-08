const enableTransmit = (pin) => {
  /* NOOP here */
};

const switchOn = (systemCode, unitCode) => {
  console.log(`Mock switching <${systemCode}#${unitCode}> ON!`);
};

const switchOff = (systemCode, unitCode) => {
  console.log(`Mock switching <${systemCode}#${unitCode}> OFF!`);
};

export default {
  enableTransmit,
  switchOn,
  switchOff
};
