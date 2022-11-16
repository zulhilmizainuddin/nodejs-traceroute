import { Flag } from './flag';
import { Hop, Process } from './process';

export class Traceroute extends Process {
    constructor(ipVersion = '', sendwait = 0) {
        const args = ['-q', '1', '-z', `${sendwait}`, '-n'];

        const ipFlag = Flag.getIpFlag(ipVersion);
        if (ipFlag) {
            args.push(ipFlag);
        }

        super('traceroute', args);
    }

    public  parseDestination(data: string): string | null {
        const regex = /^traceroute\sto\s(?:[a-zA-Z0-9:.]+)\s\(([a-zA-Z0-9:.]+)\)/;
        const parsedData = new RegExp(regex, '').exec(data);

        let result = null;
        if (parsedData !== null) {
            result = parsedData[1];
        }

        return result;
    }

    public parseHop(hopData: string): Hop | null {
        const regex = /^\s*(\d+)\s+(?:([a-zA-Z0-9:.]+)\s+([0-9.]+\s+ms)|(\*))/;
        const parsedData = new RegExp(regex, '').exec(hopData);

        let result: Hop | null = null;
        if (parsedData !== null) {
            if (parsedData[4] === undefined) {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[2],
                    rtt1: parsedData[3]
                };
            }
            else {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[4],
                    rtt1: parsedData[4]
                };
            }
        }

        return result;
    }
}
