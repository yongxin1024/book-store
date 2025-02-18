'use strict';

const {networkInterfaces} = require('os');

const IPAddress = () => {
    const nets = networkInterfaces();
    const ips = new Set();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal && !name.includes('vEthernet')) {
                ips.add(net.address);
            }
        }
    }
    if (ips.size === 0) {
        ips.add('127.0.0.1');
    }
    return ips; // Ensure the results are returned
};

module.exports = IPAddress;
