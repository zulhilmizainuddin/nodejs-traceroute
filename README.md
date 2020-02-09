# nodejs-traceroute [![Code Climate](https://codeclimate.com/github/zulhilmizainuddin/nodejs-traceroute/badges/gpa.svg)](https://codeclimate.com/github/zulhilmizainuddin/nodejs-traceroute)

[![NPM](https://nodei.co/npm/nodejs-traceroute.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nodejs-traceroute/)

Node.js wrapper around tracert and traceroute process

## Install

    npm install --save nodejs-traceroute

## Force IPv4 or IPv6
By default, the domain name given will be automatically resolved. Explicitly force IPv4 or IPv6 tracerouting by passing either `ipv4` or `ipv6` to the constructor.


## Usage Example

```javascript
const Traceroute = require('nodejs-traceroute');

try {
    const tracer = new Traceroute();
    tracer
        .on('pid', (pid) => {
            console.log(`pid: ${pid}`);
        })
        .on('destination', (destination) => {
            console.log(`destination: ${destination}`);
        })
        .on('hop', (hop) => {
            console.log(`hop: ${JSON.stringify(hop)}`);
        })
        .on('close', (code) => {
            console.log(`close: code ${code}`);
        });

    tracer.trace('github.com');
} catch (ex) {
    console.log(ex);
}
```

## Result Example

    pid: 4414
    destination: 192.30.253.112
    hop: {"hop":1,"ip":"192.168.0.1","rtt1":"1.817 ms"}
    hop: {"hop":2,"ip":"10.233.33.58","rtt1":"3.149 ms"}
    hop: {"hop":3,"ip":"10.55.96.182","rtt1":"7.820 ms"}
    hop: {"hop":4,"ip":"128.241.1.205","rtt1":"178.187 ms"}
    hop: {"hop":5,"ip":"129.250.2.9","rtt1":"211.609 ms"}
    hop: {"hop":6,"ip":"129.250.3.43","rtt1":"229.458 ms"}
    hop: {"hop":7,"ip":"129.250.2.163","rtt1":"237.948 ms"}
    hop: {"hop":8,"ip":"129.250.2.138","rtt1":"237.913 ms"}
    hop: {"hop":9,"ip":"129.250.2.133","rtt1":"241.748 ms"}
    hop: {"hop":10,"ip":"*","rtt1":"*"}
    hop: {"hop":11,"ip":"*","rtt1":"*"}
    hop: {"hop":12,"ip":"*","rtt1":"*"}
    hop: {"hop":13,"ip":"*","rtt1":"*"}
    hop: {"hop":14,"ip":"*","rtt1":"*"}
    hop: {"hop":15,"ip":"*","rtt1":"*"}
    hop: {"hop":16,"ip":"*","rtt1":"*"}
    hop: {"hop":17,"ip":"*","rtt1":"*"}
    hop: {"hop":18,"ip":"*","rtt1":"*"}
    hop: {"hop":19,"ip":"*","rtt1":"*"}
    hop: {"hop":20,"ip":"*","rtt1":"*"}
    hop: {"hop":21,"ip":"*","rtt1":"*"}
    hop: {"hop":22,"ip":"*","rtt1":"*"}
    hop: {"hop":23,"ip":"*","rtt1":"*"}
    hop: {"hop":24,"ip":"*","rtt1":"*"}
    hop: {"hop":25,"ip":"*","rtt1":"*"}
    hop: {"hop":26,"ip":"*","rtt1":"*"}
    hop: {"hop":27,"ip":"*","rtt1":"*"}
    hop: {"hop":28,"ip":"*","rtt1":"*"}
    hop: {"hop":29,"ip":"*","rtt1":"*"}
    hop: {"hop":30,"ip":"*","rtt1":"*"}
    close: code 0
