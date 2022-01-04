// @flow

import type { FermenterState$ } from '../types.js';
import deviceHandler from './handleDevices.js';

const handleDevices = (state$: FermenterState$) => deviceHandler(state$);

export default handleDevices;
