const { networkInterfaces } = require('os');
const fs = require('fs');
const path = require('path');

let netmask = '255.255.255.0';
let gateway = '192.168.2.1';

const configfilename = 'app-config.json';
const configpath = path.join(__dirname, configfilename);

function getLocalIPV4() {
    const interfaces = networkInterfaces();
    try {
        const config = JSON.parse(fs.readFileSync(configpath));
        if(config) {
            netmask = config.netmask || netmask;
            gateway = config.gateway || gateway;
        }
        else {
            console.log('!app-config.json file not found. Using default values.');
        }
    }
    catch (e) {
        console.log('app-config.json file not found. Using default values.');
    }
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            const address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal && address.netmask === netmask) {
                return address.address;
            }
        }
    }
    return null;
}

module.exports = {
    getLocalIPV4,
    gateway,
    netmask,
};