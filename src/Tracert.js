import { Flag } from './Flag';
import { Process } from './Process';

export class Tracert extends Process {
  constructor(ipVersion = '') {
    const args = ['-d'];

    const ipFlag = Flag.getIpFlag(ipVersion);
    if (ipFlag) {
      args.push(ipFlag);
    }

    super('tracert', args);
  }

  parseDestination(data) {
    const regex = /^Tracing\sroute\sto\s([a-zA-Z0-9:.]+)\s(?:\[([a-zA-Z0-9:.]+)\])?/;
    const parsedData = new RegExp(regex, '').exec(data);

    let result = null;
    if (parsedData) {
      const [, ipOrDomain, ip] = parsedData;

      if (ip !== undefined) {
        result = ip;
      } else {
        result = ipOrDomain;
      }
    }

    return result;
  }

  parseHop(hopData) {
    const regex = /^\s*(\d*)\s*(<?\d+\sms|\*)\s*(<?\d+\sms|\*)\s*(<?\d+\sms|\*)\s*([a-zA-Z0-9:.\s]+)/;
    const parsedData = new RegExp(regex, '').exec(hopData);

    let result = null;
    if (parsedData) {
      const [, hop, rtt1, rtt2, rtt3, ip] = parsedData;

      result = {
        hop: parseInt(hop, 10),
        rtt1,
        rtt2,
        rtt3,
        ip: ip.trim(),
      };
    }

    return result;
  }
}
