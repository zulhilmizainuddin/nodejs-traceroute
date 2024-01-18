import validator from 'validator';

import Traceroute from '../src/index';

function tracerVaildation(wait: jest.DoneCallback) {
    const tracer = new Traceroute();

    tracer
        .on('pid', (pid) => {
            expect(Number.isInteger(pid)).toBeTruthy();
        })
        .on('destination', (destination) => {
            expect(validator.isIP(destination)).toBeTruthy();
        })
        .on('hop', (hopObj) => {
            const {hop, ip, rtt1} = hopObj;

            expect(Number.isInteger(hop)).toBeTruthy();
            expect(validator.isIP(ip) || ip === '*').toBeTruthy();
            expect(/^\d+\.\d+\sms$/.test(rtt1) || rtt1 === '*').toBeTruthy();
        })
        .on('close', (code) => {
            expect(Number.isInteger(code)).toBeTruthy();

            wait();
        });
    return tracer;
}

describe('Traceroute', () => {
    it('URL: should verify pid, destination, hops and close code', (wait) => {
        const tracer = tracerVaildation(wait);

        tracer.trace('google.com');
    }, 60000);

    it('URL + Port: should verify pid, destination, hops and close code', (wait) => {
        const tracer = tracerVaildation(wait);

        tracer.trace('google.com:443');
    }, 60000);

    it('IP: should verify pid, destination, hops and close code', (wait) => {
        const tracer = tracerVaildation(wait);

        tracer.trace('127.0.0.1');
    }, 60000);
});