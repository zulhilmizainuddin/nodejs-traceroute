import { Flag } from './Flag';
import { Process } from './Process';

export class Traceroute extends Process {
  constructor(ipVersion = '', sendwait = 0) {
    const args = ['-q', 1, '-z', sendwait, '-n'];

    const ipFlag = Flag.getIpFlag(ipVersion);
    if (ipFlag) {
      args.push(ipFlag);
    }

    super('traceroute', args);
  }

  parseDestination(data) {
    const regex = /^traceroute\sto\s(?:[a-zA-Z0-9:.]+)\s\(([a-zA-Z0-9:.]+)\)/;
    const parsedData = new RegExp(regex, '').exec(data);

    let result = null;
    if (parsedData) {
      const [, ip] = parsedData;

      result = ip;
    }

    return result;
  }

  parseHop(hopData) {
    const regex = /^\s*(\d+)\s+(?:([a-zA-Z0-9:.]+)\s+([0-9.]+\s+ms)|(\*))/;
    const parsedData = new RegExp(regex, '').exec(hopData);

    let result = null;
    if (parsedData) {
      const [, hop, ip, rtt1, unknown] = parsedData;

      if (unknown === undefined) {
        result = {
          hop: parseInt(hop, 10),
          ip,
          rtt1,
        };
      } else {
        result = {
          hop: parseInt(hop, 10),
          ip: unknown,
          rtt1: unknown,
        };
      }
    }

    return result;
  }
}
