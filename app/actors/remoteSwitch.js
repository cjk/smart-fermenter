import MySwitch from './switch';
import swList from './switchList';

const swTransport = {
  type: 'radio-433mhz',
  pin: 16
};

function remoteSwitch(switchLib) {
  return (switchName, state) => {
    const sw = new MySwitch(swList.get(switchName)).set('transport', swTransport);

    const prepareSwitch = (sw) =>  {
      switchLib.enableTransmit(sw.transport.pin);
    };

    const switchOn = (sw) => {
      console.log(`[Controller] About to switch ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> ON:`);
      prepareSwitch(sw);
      switchLib.switchOn(sw.systemCode, sw.unitCode);
    };

    const switchOff = (sw) => {
      console.log(`[Controller]: About to switch ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> OFF.`);
      prepareSwitch(sw);
      switchLib.switchOff(sw.systemCode, sw.unitCode);
    };

    if (state === 'on') {
      switchOn(sw);
    } else {
      switchOff(sw);
    }
  };
}

export default remoteSwitch;
