const enableTransmit = (pin) => {
};

const switchOn = (systemCode, unitCode) => {
  console.log(`Mock switching <${systemCode}#${unitCode}> ON!`);
};

const switchOff = (systemCode, unitCode) => {
  console.log(`Mock switching <${systemCode}#${unitCode}> OFF!`);
};

export default {
  enableTransmit: enableTransmit,
  switchOn: switchOn,
  switchOff: switchOff
};
