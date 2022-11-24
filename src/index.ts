import os from 'os';

import { Tracert } from './tracert';
import { Traceroute } from './traceroute';

module.exports = os.platform() === 'win32' ? Tracert : Traceroute;

// const Tracer = os.platform() === 'win32' ? Tracert : Traceroute;

// export default Tracer;
