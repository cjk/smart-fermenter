import rcswitch from 'rcswitch';

const radioTransport = {
  type: 'radio-433mhz',
  pin-out: 16
};

const switches = {
  heater: {
    desc: 'Fermenter Closet heater',
    transport: radioTransport,
    systemCode: 11111,
    unitCode: 4
  }
};

function prepareSwitch(switch) {
  rcswitch.enableTransmit(switch.transport.pin-out);
}

function switchOn(switch) {
  prepareSwitch(switch);
  rcswitch.switchOn(switch.systemCode, switch.unitCode);
}

function switchOff(switch) {
  prepareSwitch(switch);
  rcswitch.switchOff(switch.systemCode, switch.unitCode);
}

/* rcswitch.disableTransmit(); */

function switch(type, switch) {
    if (type === 'on') {
      switchOn(switch);
    } else {
      switchOff(switch);
    }
}
