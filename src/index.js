import os from 'os';

import { Tracert } from './Tracert';
import { Traceroute } from './Traceroute';

module.exports = os.platform() === 'win32' ? Tracert : Traceroute;
