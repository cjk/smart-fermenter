const enableTransmit = (pin) => {
  /* NOOP here - used by rcswitch to prepare GPIO for output */
  console.log(`Mock preparing GPIO on PIN <${pin}>.`);
};

const switchOn = (systemCode, unitCode) => {
  /* NOOP here */
  console.log(`Mock switching <${systemCode}#${unitCode}> ON!`);
};

const switchOff = (systemCode, unitCode) => {
  /* NOOP here */
  console.log(`Mock switching <${systemCode}#${unitCode}> OFF!`);
};

export {
  enableTransmit,
  switchOn,
  switchOff
};
