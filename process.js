'use strict';

const spawn = require('child_process').spawn;
const events = require('events');
const readline = require('readline');

class Process extends events.EventEmitter {
    constructor(command, args) {
        super();

        this.command = command;
        this.args = args;
    }

    trace(domainName) {
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

    parseDestination(data) {}
    parseHop(hopData) {}
}

module.exports = Process;