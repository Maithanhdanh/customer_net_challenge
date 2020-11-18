"use strict"

const { networkInterfaces } = require("os")

const nets = networkInterfaces()
var results = {} // or just '{}', an empty object

for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		// skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
		if (net.family === "IPv4" && !net.internal) {
			if (!results[name]) {
				results[name] = []
			}

			results[name].push(net.address)
		}
	}
}
var result
if(results.eth0) {
	result = results.eth0
} else if(results.WiFi){
	result = results.WiFi
} else {
	result = results.Ethernet
}

module.exports = result[0]
