"use strict"

const { networkInterfaces } = require("os")

const nets = networkInterfaces()
var results = [] // or just '{}', an empty object

for (const name of Object.keys(nets)) {
	if (name === "WiFi" || name === "Ethernet") {
		for (const net of nets[name]) {
			// skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === "IPv4" && !net.internal) {
				if (!results[name]) {
					results = []
				}

				results.push(net.address)
			}
		}
	}
}

module.exports = results[0]
