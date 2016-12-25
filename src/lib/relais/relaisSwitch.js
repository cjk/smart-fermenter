import SwitchData from './switch';
import swList from './switchList';

function relaisSwitch(switchLib) {
  return (switchName, state) => {
    const swtch = new SwitchData(swList.get(switchName)).set('transport', swTransport);

    const prepareSwitch = (sw) => {
      switchLib.enableTransmit(sw.transport.pin);
    };

    const switchOn = (sw) => {
      // console.log(`[Controller] About to switch ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> ON:`);
      prepareSwitch(sw);
      const switchFn = switchLib.switchOn.bind(switchLib, sw.systemCode, sw.unitCode);
      secureSwitching(switchFn);
    };

    const switchOff = (sw) => {
      // console.log(`[Controller]: About to switch ${sw.desc} on <${sw.systemCode}#${sw.unitCode}> OFF.`);
      prepareSwitch(sw);
      const switchFn = switchLib.switchOff.bind(switchLib, sw.systemCode, sw.unitCode);
      secureSwitching(switchFn);
    };

    if (state === 'on') {
      switchOn(swtch);
    } else {
      switchOff(swtch);
    }
  };
}

export default relaisSwitch;
