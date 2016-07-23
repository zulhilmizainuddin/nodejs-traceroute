'use strict';

const os = require('os');

const tracert = require('./tracert');
const traceroute = require('./traceroute');

module.exports = os.platform() === 'win32' ? tracert : traceroute;