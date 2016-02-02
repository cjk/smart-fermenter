import Kefir from 'kefir';
import SwitchData from './switch';
import swList from './switchList';

const handleDevices = (envStream) => {

  Kefir.withInterval(4000, (emitter => {
    envStream.take(1).onValue(v => console.log('[deviceHandler] ', v.heater.get('shouldBeRunning')));
    //emitter.emit();
    //r.log();
    //console.log()
  })).onValue(() => {});
};

/* TODO: Old code - rewrite + refactor into the above: */
const swTransport = {
  type: 'radio-433mhz',
  pin: 16
};

function remoteSwitch(switchLib) {
  return (switchName, state) => {
    const sw = new SwitchData(swList.get(switchName)).set('transport', swTransport);

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

export default handleDevices;
