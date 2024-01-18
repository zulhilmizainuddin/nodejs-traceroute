import events from 'events';
import readline from 'readline';
import validator from 'validator';

import { spawn } from 'child_process';

export interface Hop {
    hop: number;
    ip: string;
    rtt1: string;
    rtt2?: string;
    rtt3?: string;
}

export abstract class Process extends events.EventEmitter {
    constructor(private command: string, private args: string[]) {
        super();
    }

    public trace(domainName: string): void {
        if (validator.isFQDN(domainName) || validator.isIP(domainName)) {
            this.args.push(domainName);
        } else if (validator.isURL(domainName)) {
            const url = new URL(domainName);
            this.args.push(...[url.hostname, '-p', url.port]);
        } else {
            throw "Invalid domain";
        }

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

    abstract parseDestination(data: string): string | null;
    abstract parseHop(hopData: string): Hop | null;
}
