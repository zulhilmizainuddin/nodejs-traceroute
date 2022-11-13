import events from 'events';
import readline from 'readline';
import validator from 'validator';

import { spawn } from 'child_process';

export class Process extends events.EventEmitter {
    constructor(private command: string, private args: string[]) {
        super();
    }

    trace(domainName: string) {
        if (!this.isValidDomainName(domainName)) {
            throw "Invalid domain name or IP address";
        }

        this.args.push(domainName);

        const process = spawn(this.command, this.args);
        process.on('close', (code) => {
            this.emit('close', code);
        });

        this.emit('pid', process.pid);

        let isDestinationCaptured = false;
        if (process.pid) {
            readline.createInterface({
                    input: process.stdout,
                    terminal: false
                })
                .on('line', (line) => {
                    if (!isDestinationCaptured) {
                        const destination = this.parseDestination(line);
                        if (destination !== null) {
                            this.emit('destination', destination);

                            isDestinationCaptured = true;
                        }
                    }

                    const hop = this.parseHop(line);
                    if (hop !== null) {
                        this.emit('hop', hop);
                    }
                });
        }
    }

    isValidDomainName(domainName: string) {
        return validator.isFQDN(domainName + '') || validator.isIP(domainName + '');
    }

    parseDestination(data: string) {}
    parseHop(hopData: string) {}
}
