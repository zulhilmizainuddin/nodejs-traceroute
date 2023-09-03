import events from 'events';
import readline from 'readline';
import validator from 'validator';

import { spawn } from 'child_process';
import { createReadStream, createWriteStream, ReadStream, WriteStream } from 'fs';

export interface Hop {
    hop: number;
    ip: string;
    rtt1: string;
    rtt2?: string;
    rtt3?: string;
}

export abstract class Process extends events.EventEmitter {
    private readonly streamPath: string = `/tmp/nodejs-traceroute-${Date.now()}.log`;

    constructor(private command: string, private args: string[]) {
        super();
    }

    public trace(domainName: string): void {
        if (!this.isValidDomainName(domainName)) {
            throw "Invalid domain name or IP address";
        }

        this.args.push(domainName);

        const childProcess = spawn(this.command, this.args, { stdio: ['ignore', 'pipe', 'pipe'] });

        const writeStream: WriteStream = createWriteStream(this.streamPath);

        childProcess.stdout.pipe(writeStream);
        childProcess.stderr.pipe(writeStream);

        const readStream: ReadStream = createReadStream(this.streamPath);

        childProcess.on('close', (code) => {
            writeStream.close();
            readStream.close();
            this.emit('close', code);
        });

        this.emit('pid', childProcess.pid);

        let isDestinationCaptured = false;
        if (childProcess.pid) {
            readline.createInterface({
                    input: readStream,
                    terminal: false,
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

    private isValidDomainName(domainName: string): boolean {
        return validator.isFQDN(domainName + '') || validator.isIP(domainName + '');
    }

    abstract parseDestination(data: string): string | null;
    abstract parseHop(hopData: string): Hop | null;
}
