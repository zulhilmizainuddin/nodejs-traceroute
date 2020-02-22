import { spawn } from 'child_process';
import events from 'events';
import readline from 'readline';

import { Validation } from './Validation';

export class Process extends events.EventEmitter {
  constructor(command, args) {
    super();

    this.command = command;
    this.args = args;
  }

  trace(domainName) {
    if (!Validation.isValidDomainName(domainName)) {
      throw new Error('Invalid domain name or IP address');
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

  // eslint-disable-next-line no-unused-vars
  parseDestination(data) {}

  // eslint-disable-next-line no-unused-vars
  parseHop(hopData) {}
}
