import deviceHandler from './handleDevices';

/* TODO: old code - probably no longer needed here: */
//import remoteSwitch from './remoteSwitch';
///* Physical switching is done here: */
//import Switch from './simulatedSwitch';
////import Switch from 'rcswitch';

const handleDevices = (envStream) => deviceHandler(envStream);

export default handleDevices;
