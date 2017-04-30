import type { FermenterState$ } from '../types';
import deviceHandler from './handleDevices';

const handleDevices = (state$: FermenterState$) => deviceHandler(state$);

export default handleDevices;
