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
        if (!this.isValidUrl(domainName)) {
            throw "Invalid domain name or IP address";
        }

        const splitUrl = this.splitUrl(domainName);
        // Does the URL contain a port?
        if (splitUrl.length > 1) {
            this.args.push(...[splitUrl[0], '-p', splitUrl[1]]);
        } else {
            this.args.push(domainName);
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

    private isValidUrl(url: string): boolean {
        return validator.isURL(url + '') || validator.isIP(url + '');
    }

    private splitUrl(url: string): string[] {
        return url.split(':');
    }

    abstract parseDestination(data: string): string | null;
    abstract parseHop(hopData: string): Hop | null;
}
