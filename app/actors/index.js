import remoteSwitch from './remoteSwitch';

import Switch from './simulatedSwitch';
// import Switch from 'rcswitch';

// const setupSwitch = (sw) => remoteSwitch(sw);

// function selectSwitch() {
//   const Switch = (process.env['SIM']) ? 'rcswitch' : 'simulatedSwitch';
//   System.import(Switch).then(sw => sw);
// }

export default remoteSwitch(Switch);
