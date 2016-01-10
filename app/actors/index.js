import rcswitch from 'rcswitch';

const radioTransport = {
  type: 'radio-433mhz',
  pin: 16
};

const switches = {
  heater: {
    desc: 'Fermenter Closet heater',
    transport: radioTransport,
    systemCode: '10011',
    unitCode: 2
  }
};

function prepareSwitch(sw) {
  console.log('Transmitting using PIN #'+sw.transport.pin);
  rcswitch.enableTransmit(sw.transport.pin);
}

function switchOn(sw) {
  console.log(`Switching ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> ON:`)
  prepareSwitch(sw);
  rcswitch.switchOn(sw.systemCode, sw.unitCode);
}

function switchOff(sw) {
  console.log(`Switching ${sw.desc} OFF.`)
  prepareSwitch(sw);
  rcswitch.switchOff(sw.systemCode, sw.unitCode);
}

/* rcswitch.disableTransmit(); */

function remoteSwitch(switchName, state) {
  const sw = switches[switchName];

  if (state === 'on') {
    switchOn(sw);
  } else {
    switchOff(sw);
  }
}

export default remoteSwitch;
